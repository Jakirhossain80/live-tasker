import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { KanbanSquare, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getBoardById, getBoards, isValidBoardId, updateBoard, type Board, type BoardColumn } from '../../api/boards'
import {
  createTask,
  deleteTask,
  getTasks,
  moveTask,
  updateTask,
  type CreateTaskPayload,
  type MoveTaskPayload,
  type Task,
  type TaskPriority,
  type UpdateTaskPayload,
} from '../../api/tasks'
import { getWorkspaces } from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import KanbanColumn, { type KanbanTask } from '../../components/kanban/KanbanColumn'
import CreateTaskModal from '../../components/kanban/CreateTaskModal'
import EditTaskModal from '../../components/kanban/EditTaskModal'
import KanbanHeader from '../../components/kanban/KanbanHeader'
import { useOnlineUsers } from '../../hooks/useOnlineUsers'
import { useSocket } from '../../hooks/useSocket'
import { emitTaskMoved, type TaskMovedPayload } from '../../socket/socket'

type KanbanColumnData = {
  id: string
  title: string
  count: number
  accentClassName: string
  tasks: KanbanTask[]
}

type TaskCreatedPayload = {
  task: Task
}

type TaskUpdatedPayload = {
  task: Task
}

type BackendTaskMovedPayload = {
  task: Task
}

type TaskMovedEventPayload = TaskMovedPayload | BackendTaskMovedPayload

const accentClassNames = [
  'bg-slate-400',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
]

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const priorityClassNames: Record<TaskPriority, string> = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
  urgent: 'bg-red-50 text-red-700',
}

const emptyTasks: Task[] = []
const selectedWorkspaceStorageKey = 'livetasker:selectedWorkspaceId'

function getSavedWorkspaceId() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    return window.localStorage.getItem(selectedWorkspaceStorageKey) || undefined
  } catch {
    return undefined
  }
}

function formatDueDate(dueDate?: string) {
  if (!dueDate) {
    return undefined
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dueDate))
}

function mapTask(task: Task): KanbanTask {
  return {
    id: task._id,
    status: task.status,
    order: task.order,
    title: task.title,
    description: task.description,
    priority: priorityLabels[task.priority],
    dueDate: formatDueDate(task.dueDate),
    priorityClassName: priorityClassNames[task.priority],
  }
}

function mapBoardColumns(columns: BoardColumn[], tasks: Task[]): KanbanColumnData[] {
  return [...columns]
    .sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order)
    .map((column, index) => ({
      id: column._id,
      title: column.title,
      count: tasks.filter((task) => task.status === column._id).length,
      accentClassName: accentClassNames[index % accentClassNames.length],
      tasks: tasks
        .filter((task) => task.status === column._id)
        .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
        .map(mapTask),
    }))
}

function getColumnIdFromDragTarget(columns: KanbanColumnData[], targetId: UniqueIdentifier | null | undefined) {
  if (!targetId) {
    return undefined
  }

  const targetIdValue = String(targetId)
  const targetColumn = columns.find((column) => column.id === targetIdValue)

  if (targetColumn) {
    return targetColumn.id
  }

  return columns.find((column) => column.tasks.some((task) => task.id === targetIdValue))?.id
}

function getTaskIdFromDragTarget(columns: KanbanColumnData[], targetId: UniqueIdentifier | null | undefined) {
  if (!targetId) {
    return undefined
  }

  const targetIdValue = String(targetId)

  return columns.some((column) => column.tasks.some((task) => task.id === targetIdValue)) ? targetIdValue : undefined
}

function reorderTasksForMove(tasks: Task[], taskId: string, targetColumnId: string, targetTaskId?: string) {
  const activeTask = tasks.find((task) => task._id === taskId)

  if (!activeTask) {
    return undefined
  }

  const sourceColumnId = activeTask.status
  const sourceColumnTasks = tasks
    .filter((task) => task.status === sourceColumnId && task._id !== taskId)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const targetColumnTasks = tasks
    .filter((task) => task.status === targetColumnId && task._id !== taskId)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const targetTaskIndex = targetTaskId ? targetColumnTasks.findIndex((task) => task._id === targetTaskId) : -1
  const insertIndex = targetTaskIndex >= 0 ? targetTaskIndex : targetColumnTasks.length
  const nextTargetColumnTasks = [
    ...targetColumnTasks.slice(0, insertIndex),
    { ...activeTask, status: targetColumnId },
    ...targetColumnTasks.slice(insertIndex),
  ]
  const reorderedTaskMap = new Map<string, Task>()

  if (sourceColumnId !== targetColumnId) {
    sourceColumnTasks.forEach((task, order) => {
      reorderedTaskMap.set(task._id, { ...task, order })
    })
  }

  nextTargetColumnTasks.forEach((task, order) => {
    reorderedTaskMap.set(task._id, { ...task, status: targetColumnId, order })
  })

  return {
    nextTasks: tasks.map((task) => reorderedTaskMap.get(task._id) ?? task),
    newOrder: insertIndex,
  }
}

function applyTaskMovedEvent(tasks: Task[], payload: TaskMovedPayload) {
  const movedTask = tasks.find((task) => task._id === payload.taskId)

  if (!movedTask) {
    return tasks
  }

  const sourceColumnId = movedTask.status
  const targetColumnId = payload.toStatus
  const sourceColumnTasks = tasks
    .filter((task) => task.status === sourceColumnId && task._id !== payload.taskId)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const targetColumnTasks = tasks
    .filter((task) => task.status === targetColumnId && task._id !== payload.taskId)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const insertIndex = Math.max(0, Math.min(payload.order, targetColumnTasks.length))
  const nextTargetColumnTasks = [
    ...targetColumnTasks.slice(0, insertIndex),
    { ...movedTask, status: targetColumnId },
    ...targetColumnTasks.slice(insertIndex),
  ]
  const reorderedTaskMap = new Map<string, Task>()

  if (sourceColumnId !== targetColumnId) {
    sourceColumnTasks.forEach((task, order) => {
      reorderedTaskMap.set(task._id, { ...task, order })
    })
  }

  nextTargetColumnTasks.forEach((task, order) => {
    reorderedTaskMap.set(task._id, { ...task, status: targetColumnId, order })
  })

  return tasks.map((task) => reorderedTaskMap.get(task._id) ?? task)
}

function applyMovedTask(tasks: Task[], nextTask: Task) {
  const currentTask = tasks.find((task) => task._id === nextTask._id)

  if (!currentTask) {
    return upsertTask(tasks, nextTask)
  }

  const sourceColumnId = currentTask.status
  const targetColumnId = nextTask.status
  const sourceColumnTasks = tasks
    .filter((task) => task.status === sourceColumnId && task._id !== nextTask._id)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const targetColumnTasks = tasks
    .filter((task) => task.status === targetColumnId && task._id !== nextTask._id)
    .sort((firstTask, secondTask) => firstTask.order - secondTask.order)
  const insertIndex = Math.max(0, Math.min(nextTask.order, targetColumnTasks.length))
  const nextTargetColumnTasks = [
    ...targetColumnTasks.slice(0, insertIndex),
    nextTask,
    ...targetColumnTasks.slice(insertIndex),
  ]
  const reorderedTaskMap = new Map<string, Task>()

  if (sourceColumnId !== targetColumnId) {
    sourceColumnTasks.forEach((task, order) => {
      reorderedTaskMap.set(task._id, { ...task, order })
    })
  }

  nextTargetColumnTasks.forEach((task, order) => {
    reorderedTaskMap.set(task._id, { ...task, status: targetColumnId, order })
  })

  return tasks.map((task) => reorderedTaskMap.get(task._id) ?? task)
}

function upsertTask(tasks: Task[], nextTask: Task) {
  const existingTaskIndex = tasks.findIndex((task) => task._id === nextTask._id)

  if (existingTaskIndex === -1) {
    return [...tasks, nextTask]
  }

  return tasks.map((task) => (task._id === nextTask._id ? nextTask : task))
}

function getTaskBoardId(task: Task) {
  return typeof task.board === 'string' ? task.board : task.board._id
}

function getBoardWorkspaceId(board?: Board) {
  if (!board) {
    return undefined
  }

  return typeof board.workspace === 'string' ? board.workspace : board.workspace._id
}

function isBackendTaskMovedPayload(payload: TaskMovedEventPayload): payload is BackendTaskMovedPayload {
  return 'task' in payload
}

function getTaskMovedSignature(payload: TaskMovedPayload) {
  return getTaskMoveSignature(payload.boardId, payload.taskId, payload.toStatus, payload.order)
}

function getTaskMoveSignature(boardId: string, taskId: string, status: string, order: number) {
  return `${boardId}:${taskId}:${status}:${order}`
}

function getAssigneeId(assignee: Task['assignees'][number]) {
  return typeof assignee === 'string' ? assignee : assignee._id
}

function getTaskListSignature(tasks: Task[]) {
  return tasks
    .map((task) => {
      const assigneeIds = task.assignees.map(getAssigneeId).join(',')
      const labels = task.labels.join(',')

      return [
        task._id,
        task.status,
        task.order,
        task.title,
        task.description ?? '',
        task.priority,
        task.dueDate ?? '',
        labels,
        assigneeIds,
        task.isArchived,
        task.updatedAt,
      ].join(':')
    })
    .join('|')
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : 'Could not create task.'
}

function ProjectBoard() {
  const { boardId } = useParams()
  const hasValidBoardId = isValidBoardId(boardId)
  const hasJoinableBoardId = Boolean(boardId && boardId !== 'demo-board' && hasValidBoardId)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { socket, isConnected } = useSocket()
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [localTasks, setLocalTasks] = useState<Task[]>([])
  const [createTaskErrorMessage, setCreateTaskErrorMessage] = useState<string>()
  const [editTaskErrorMessage, setEditTaskErrorMessage] = useState<string>()
  const [deleteTaskErrorMessage, setDeleteTaskErrorMessage] = useState<string>()
  const [deleteColumnErrorMessage, setDeleteColumnErrorMessage] = useState<string>()
  const [moveTaskErrorMessage, setMoveTaskErrorMessage] = useState<string>()
  const [savedWorkspaceId] = useState(() => getSavedWorkspaceId())
  const handledCreateTaskLocationKeyRef = useRef<string | undefined>(undefined)
  const recentLocalMoveSignaturesRef = useRef(new Set<string>())
  const recentLocalMoveTimeoutsRef = useRef<ReturnType<typeof window.setTimeout>[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const {
    data: board,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoardById(boardId as string),
    enabled: hasValidBoardId,
  })
  const {
    data: fetchedTasks = emptyTasks,
    isLoading: areTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => getTasks(boardId as string),
    enabled: hasValidBoardId,
  })
  const fetchedTasksSignature = useMemo(() => getTaskListSignature(fetchedTasks), [fetchedTasks])
  const boardWorkspaceId = getBoardWorkspaceId(board)
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })
  const activeWorkspaces = useMemo(() => workspaces?.filter((workspace) => !workspace.isArchived) ?? [], [workspaces])
  const selectedWorkspace = useMemo(
    () =>
      activeWorkspaces.find((workspace) => workspace._id === savedWorkspaceId) ??
      activeWorkspaces.find((workspace) => workspace._id === boardWorkspaceId) ??
      activeWorkspaces[0],
    [activeWorkspaces, boardWorkspaceId, savedWorkspaceId],
  )
  const workspaceId = selectedWorkspace?._id ?? boardWorkspaceId
  const onlineUsers = useOnlineUsers(workspaceId)
  const { data: workspaceBoards = [] } = useQuery({
    queryKey: ['boards', workspaceId],
    queryFn: () => getBoards(workspaceId as string),
    enabled: Boolean(workspaceId),
  })
  const boardOptions = useMemo(() => {
    const activeBoards = workspaceBoards
      .filter(
        (workspaceBoard) =>
          !workspaceBoard.isArchived && workspaceBoard._id !== 'demo-board' && isValidBoardId(workspaceBoard._id),
      )
      .map((workspaceBoard) => ({ id: workspaceBoard._id, name: workspaceBoard.name }))

    if (!board || activeBoards.some((workspaceBoard) => workspaceBoard.id === board._id)) {
      return activeBoards
    }

    return [{ id: board._id, name: board.name }, ...activeBoards]
  }, [board, workspaceBoards])

  useEffect(() => {
    setLocalTasks((currentTasks) =>
      getTaskListSignature(currentTasks) === fetchedTasksSignature ? currentTasks : fetchedTasks,
    )
  }, [fetchedTasks, fetchedTasksSignature])

  useEffect(() => {
    if (!hasJoinableBoardId || !boardId || !isConnected) {
      return
    }

    socket.emit('joinBoard', { boardId })

    return () => {
      if (socket.connected) {
        socket.emit('leaveBoard', { boardId })
      }
    }
  }, [boardId, hasJoinableBoardId, isConnected, socket])

  useEffect(() => {
    if (!hasJoinableBoardId || !boardId) {
      return
    }

    function handleTaskCreated(payload: TaskCreatedPayload) {
      if (getTaskBoardId(payload.task) !== boardId) {
        return
      }

      setLocalTasks((currentTasks) => upsertTask(currentTasks, payload.task))
      queryClient.setQueryData<Task[]>(['tasks', boardId], (currentTasks = []) => upsertTask(currentTasks, payload.task))
    }

    function handleTaskUpdated(payload: TaskUpdatedPayload) {
      if (getTaskBoardId(payload.task) !== boardId) {
        return
      }

      setLocalTasks((currentTasks) => upsertTask(currentTasks, payload.task))
      queryClient.setQueryData<Task[]>(['tasks', boardId], (currentTasks = []) => upsertTask(currentTasks, payload.task))
    }

    function handleTaskMoved(payload: TaskMovedEventPayload) {
      if (isBackendTaskMovedPayload(payload)) {
        if (getTaskBoardId(payload.task) !== boardId) {
          return
        }

        const moveSignature = getTaskMoveSignature(boardId, payload.task._id, payload.task.status, payload.task.order)

        if (recentLocalMoveSignaturesRef.current.has(moveSignature)) {
          recentLocalMoveSignaturesRef.current.delete(moveSignature)
          queryClient.setQueryData<Task[]>(['tasks', boardId], (currentTasks = []) =>
            applyMovedTask(currentTasks, payload.task),
          )
          return
        }

        setLocalTasks((currentTasks) => applyMovedTask(currentTasks, payload.task))
        queryClient.setQueryData<Task[]>(['tasks', boardId], (currentTasks = []) =>
          applyMovedTask(currentTasks, payload.task),
        )
        return
      }

      if (payload.boardId !== boardId) {
        return
      }

      const moveSignature = getTaskMovedSignature(payload)

      if (recentLocalMoveSignaturesRef.current.has(moveSignature)) {
        recentLocalMoveSignaturesRef.current.delete(moveSignature)
        return
      }

      setLocalTasks((currentTasks) => applyTaskMovedEvent(currentTasks, payload))
      queryClient.setQueryData<Task[]>(['tasks', boardId], (currentTasks = []) => applyTaskMovedEvent(currentTasks, payload))
    }

    socket.on('taskCreated', handleTaskCreated)
    socket.on('taskUpdated', handleTaskUpdated)
    socket.on('taskMoved', handleTaskMoved)

    return () => {
      socket.off('taskCreated', handleTaskCreated)
      socket.off('taskUpdated', handleTaskUpdated)
      socket.off('taskMoved', handleTaskMoved)

      recentLocalMoveTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      recentLocalMoveTimeoutsRef.current = []
      recentLocalMoveSignaturesRef.current.clear()
    }
  }, [boardId, hasJoinableBoardId, queryClient, socket])

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(boardId as string, payload),
    onSuccess: async () => {
      setIsCreateTaskModalOpen(false)
      setCreateTaskErrorMessage(undefined)
      toast.success('Task created.')
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError)

      setCreateTaskErrorMessage(message)
      toast.error(message)
    },
  })
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) => updateTask(taskId, payload),
    onSuccess: async () => {
      setIsEditTaskModalOpen(false)
      setSelectedTask(null)
      setEditTaskErrorMessage(undefined)
      toast.success('Task updated.')
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError)

      setEditTaskErrorMessage(message)
      toast.error(message)
    },
  })
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      setDeleteTaskErrorMessage(undefined)
      toast.success('Task deleted.')
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError)

      setDeleteTaskErrorMessage(message)
      toast.error(message)
    },
  })
  const deleteColumnMutation = useMutation({
    mutationFn: ({ columnId }: { columnId: string }) => {
      if (!board || !boardId) {
        throw new Error('Could not delete column.')
      }

      const nextColumns = board.columns
        .filter((column) => column._id !== columnId)
        .sort((firstColumn, secondColumn) => firstColumn.order - secondColumn.order)
        .map((column, order) => ({
          _id: column._id,
          title: column.title,
          order,
        }))

      return updateBoard(boardId, { columns: nextColumns })
    },
    onSuccess: async (updatedBoard) => {
      setDeleteColumnErrorMessage(undefined)
      queryClient.setQueryData<Board>(['board', boardId], updatedBoard)
      toast.success('Column deleted.')
      await queryClient.invalidateQueries({ queryKey: ['board', boardId] })

      const updatedWorkspaceId = getBoardWorkspaceId(updatedBoard)

      if (updatedWorkspaceId) {
        await queryClient.invalidateQueries({ queryKey: ['boards', updatedWorkspaceId] })
      }
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError)

      setDeleteColumnErrorMessage(message)
      toast.error(message)
    },
  })
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: MoveTaskPayload }) => moveTask(taskId, payload),
    onSuccess: async () => {
      setMoveTaskErrorMessage(undefined)
      toast.success('Task moved.')
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError)

      setMoveTaskErrorMessage(message)
      toast.error(message)
    },
  })
  const columns = useMemo(() => (board ? mapBoardColumns(board.columns, localTasks) : []), [board, localTasks])
  const columnOptions = useMemo(() => columns.map((column) => ({ id: column.id, title: column.title })), [columns])
  const defaultTaskStatus = useMemo(() => selectedColumnId || columns[0]?.id || '', [columns, selectedColumnId])

  useEffect(() => {
    if (
      !location.state?.openCreateTask ||
      handledCreateTaskLocationKeyRef.current === location.key ||
      columns.length === 0
    ) {
      return
    }

    handledCreateTaskLocationKeyRef.current = location.key
    openCreateTaskModal(columns[0].id)
  }, [columns, location.key, location.state])

  function openCreateTaskModal(columnId: string) {
    setSelectedColumnId(columnId)
    setCreateTaskErrorMessage(undefined)
    setIsCreateTaskModalOpen(true)
  }

  function closeCreateTaskModal() {
    if (!createTaskMutation.isPending) {
      setIsCreateTaskModalOpen(false)
      setCreateTaskErrorMessage(undefined)
    }
  }

  function handleCreateTask(payload: CreateTaskPayload) {
    setCreateTaskErrorMessage(undefined)
    createTaskMutation.mutate(payload)
  }

  function closeEditTaskModal() {
    if (!updateTaskMutation.isPending) {
      setIsEditTaskModalOpen(false)
      setSelectedTask(null)
      setEditTaskErrorMessage(undefined)
    }
  }

  function handleTaskClick(taskId: string) {
    navigate(`/dashboard/tasks/${taskId}`)
  }

  function handleBoardChange(nextBoardId: string) {
    if (nextBoardId !== boardId) {
      navigate(`/dashboard/boards/${nextBoardId}`)
    }
  }

  function handleEditTask(taskId: string) {
    const task = localTasks.find((taskItem) => taskItem._id === taskId)

    if (task) {
      setSelectedTask(task)
      setEditTaskErrorMessage(undefined)
      setIsEditTaskModalOpen(true)
    }
  }

  function handleUpdateTask(taskId: string, payload: UpdateTaskPayload) {
    setEditTaskErrorMessage(undefined)
    updateTaskMutation.mutate({ taskId, payload })
  }

  function handleDeleteTask(taskId: string) {
    const task = localTasks.find((taskItem) => taskItem._id === taskId)
    const confirmed = window.confirm(`Delete "${task?.title || 'this task'}"?`)

    if (confirmed) {
      setDeleteTaskErrorMessage(undefined)
      deleteTaskMutation.mutate(taskId)
    }
  }

  function handleDeleteColumn(columnId: string) {
    if (!board || deleteColumnMutation.isPending) {
      return
    }

    const column = columns.find((columnItem) => columnItem.id === columnId)

    if (!column) {
      return
    }

    if (board.columns.length <= 1) {
      const message = 'You cannot delete the last remaining column.'

      setDeleteColumnErrorMessage(message)
      toast.error(message)
      return
    }

    if (column.count > 0) {
      const message = 'Move all tasks out of this column before deleting it.'

      setDeleteColumnErrorMessage(message)
      toast.error(message)
      return
    }

    const confirmed = window.confirm(`Delete "${column.title}" column?`)

    if (confirmed) {
      setDeleteColumnErrorMessage(undefined)
      deleteColumnMutation.mutate({ columnId })
    }
  }

  function handleMoveTask(taskId: string, status: string) {
    const task = localTasks.find((taskItem) => taskItem._id === taskId)

    if (!task || task.status === status) {
      return
    }

    const targetOrder = localTasks.filter((taskItem) => taskItem.status === status).length

    setMoveTaskErrorMessage(undefined)
    moveTaskMutation.mutate({
      taskId,
      payload: {
        status,
        order: targetOrder,
      },
    })
  }

  if (!hasValidBoardId) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <EmptyState
          icon={KanbanSquare}
          title="No board selected"
          message="Open a board from a workspace to view its columns."
        />
      </div>
    )
  }

  if (isLoading || areTasksLoading) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <LoadingState title="Loading board" message="Fetching board columns and tasks from your workspace." />
      </div>
    )
  }

  if (isError || !board) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not load board"
          message={error instanceof Error ? error.message : 'Please try again in a moment.'}
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  if (isTasksError) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not load tasks"
          message={tasksError instanceof Error ? tasksError.message : 'Please try again in a moment.'}
          onRetry={() => {
            void refetchTasks()
          }}
        />
      </div>
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeTaskId = String(event.active.id)
    const targetColumnId = getColumnIdFromDragTarget(columns, event.over?.id)
    const targetTaskId = getTaskIdFromDragTarget(columns, event.over?.id)
    const currentBoardId = boardId

    if (!currentBoardId || !targetColumnId) {
      return
    }

    const activeTask = localTasks.find((task) => task._id === activeTaskId)

    if (!activeTask || activeTaskId === targetTaskId) {
      return
    }

    const previousTasks = localTasks
    const fromStatus = activeTask.status
    const moveResult = reorderTasksForMove(localTasks, activeTaskId, targetColumnId, targetTaskId)

    if (!moveResult) {
      return
    }

    const { nextTasks, newOrder } = moveResult

    setMoveTaskErrorMessage(undefined)
    setLocalTasks(nextTasks)
    moveTaskMutation.mutate(
      {
        taskId: activeTaskId,
        payload: {
          status: targetColumnId,
          order: newOrder,
        },
      },
      {
        onSuccess: () => {
          const taskMovedPayload = {
            boardId: currentBoardId,
            taskId: activeTaskId,
            fromStatus,
            toStatus: targetColumnId,
            order: newOrder,
          }
          const moveSignature = getTaskMovedSignature(taskMovedPayload)
          const timeoutId = window.setTimeout(() => {
            recentLocalMoveSignaturesRef.current.delete(moveSignature)
          }, 5000)

          recentLocalMoveSignaturesRef.current.add(moveSignature)
          recentLocalMoveTimeoutsRef.current.push(timeoutId)
          emitTaskMoved(taskMovedPayload)
        },
        onError: (mutationError) => {
          setLocalTasks(previousTasks)
          setMoveTaskErrorMessage(getErrorMessage(mutationError))
        },
      },
    )
  }

  return (
    <div className="mx-auto flex min-w-0 max-w-full flex-col gap-6">
      <KanbanHeader
        title={board.name}
        description={board.description}
        onlineUsers={onlineUsers}
        boardOptions={boardOptions}
        selectedBoardId={boardId}
        onBoardChange={handleBoardChange}
      />

      {deleteTaskErrorMessage ? (
        <ErrorState title="Could not delete task" message={deleteTaskErrorMessage} />
      ) : null}
      {deleteColumnErrorMessage ? (
        <ErrorState title="Could not delete column" message={deleteColumnErrorMessage} />
      ) : null}
      {moveTaskErrorMessage ? (
        <ErrorState title="Could not move task" message={moveTaskErrorMessage} />
      ) : null}

      <div className="kanban-board-scroll min-h-[calc(100vh-196px)] w-full max-w-full overflow-x-scroll overflow-y-hidden pb-3 sm:min-h-[calc(100vh-172px)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full min-w-full flex-nowrap gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                count={column.count}
                accentClassName={column.accentClassName}
                tasks={column.tasks}
                columnOptions={columnOptions}
                showAddTaskButton
                isDragEnabled
                isDropEnabled
                columnId={column.id}
                onAddTask={openCreateTaskModal}
                onTaskClick={handleTaskClick}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
            <button
              type="button"
              className="flex min-h-[calc(100vh-196px)] min-w-[320px] max-w-[320px] shrink-0 items-start justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:min-h-[calc(100vh-172px)]"
            >
              <Plus className="mt-0.5 h-4 w-4" />
              New Column
            </button>
          </div>
        </DndContext>
      </div>

      <CreateTaskModal
        columns={board.columns}
        defaultStatus={defaultTaskStatus}
        isOpen={isCreateTaskModalOpen}
        isSubmitting={createTaskMutation.isPending}
        errorMessage={createTaskErrorMessage}
        onClose={closeCreateTaskModal}
        onSubmit={handleCreateTask}
      />
      <EditTaskModal
        task={selectedTask}
        isOpen={isEditTaskModalOpen}
        isSubmitting={updateTaskMutation.isPending}
        errorMessage={editTaskErrorMessage}
        onClose={closeEditTaskModal}
        onSubmit={handleUpdateTask}
      />
    </div>
  )
}

export default ProjectBoard
