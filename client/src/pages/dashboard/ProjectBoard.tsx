import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBoardById, type BoardColumn } from '../../api/boards'
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
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import KanbanColumn, { type KanbanTask } from '../../components/kanban/KanbanColumn'
import CreateTaskModal from '../../components/kanban/CreateTaskModal'
import EditTaskModal from '../../components/kanban/EditTaskModal'
import KanbanHeader from '../../components/kanban/KanbanHeader'

type KanbanColumnData = {
  id: string
  title: string
  count: number
  accentClassName: string
  tasks: KanbanTask[]
}

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
      tasks: tasks.filter((task) => task.status === column._id).map(mapTask),
    }))
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : 'Could not create task.'
}

function ProjectBoard() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [createTaskErrorMessage, setCreateTaskErrorMessage] = useState<string>()
  const [editTaskErrorMessage, setEditTaskErrorMessage] = useState<string>()
  const [deleteTaskErrorMessage, setDeleteTaskErrorMessage] = useState<string>()
  const [moveTaskErrorMessage, setMoveTaskErrorMessage] = useState<string>()
  const {
    data: board,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoardById(boardId as string),
    enabled: Boolean(boardId),
  })
  const {
    data: tasks = [],
    isLoading: areTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => getTasks(boardId as string),
    enabled: Boolean(boardId),
  })
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(boardId as string, payload),
    onSuccess: async () => {
      setIsCreateTaskModalOpen(false)
      setCreateTaskErrorMessage(undefined)
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      setCreateTaskErrorMessage(getErrorMessage(mutationError))
    },
  })
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) => updateTask(taskId, payload),
    onSuccess: async () => {
      setIsEditTaskModalOpen(false)
      setSelectedTask(null)
      setEditTaskErrorMessage(undefined)
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      setEditTaskErrorMessage(getErrorMessage(mutationError))
    },
  })
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      setDeleteTaskErrorMessage(undefined)
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      setDeleteTaskErrorMessage(getErrorMessage(mutationError))
    },
  })
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: MoveTaskPayload }) => moveTask(taskId, payload),
    onSuccess: async () => {
      setMoveTaskErrorMessage(undefined)
      await queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
    onError: (mutationError) => {
      setMoveTaskErrorMessage(getErrorMessage(mutationError))
    },
  })

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

  function handleEditTask(taskId: string) {
    const task = tasks.find((taskItem) => taskItem._id === taskId)

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
    const task = tasks.find((taskItem) => taskItem._id === taskId)
    const confirmed = window.confirm(`Delete "${task?.title || 'this task'}"?`)

    if (confirmed) {
      setDeleteTaskErrorMessage(undefined)
      deleteTaskMutation.mutate(taskId)
    }
  }

  function handleMoveTask(taskId: string, status: string) {
    const task = tasks.find((taskItem) => taskItem._id === taskId)

    if (!task || task.status === status) {
      return
    }

    const targetOrder = tasks.filter((taskItem) => taskItem.status === status).length

    setMoveTaskErrorMessage(undefined)
    moveTaskMutation.mutate({
      taskId,
      payload: {
        status,
        order: targetOrder,
      },
    })
  }

  if (!boardId) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState title="Board route is missing" message="Open a board from a workspace to view its columns." />
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

  const columns = mapBoardColumns(board.columns, tasks)
  const columnOptions = columns.map((column) => ({ id: column.id, title: column.title }))
  const defaultTaskStatus = selectedColumnId || columns[0]?.id || ''

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <KanbanHeader title={board.name} description={board.description} />

      {deleteTaskErrorMessage ? (
        <ErrorState title="Could not delete task" message={deleteTaskErrorMessage} />
      ) : null}
      {moveTaskErrorMessage ? (
        <ErrorState title="Could not move task" message={moveTaskErrorMessage} />
      ) : null}

      <div className="kanban-board-scroll min-h-[calc(100vh-196px)] overflow-x-auto pb-3 sm:min-h-[calc(100vh-172px)]">
        <div className="flex h-full gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              count={column.count}
              accentClassName={column.accentClassName}
              tasks={column.tasks}
              columnOptions={columnOptions}
              showAddTaskButton
              columnId={column.id}
              onAddTask={openCreateTaskModal}
              onTaskClick={handleTaskClick}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
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
