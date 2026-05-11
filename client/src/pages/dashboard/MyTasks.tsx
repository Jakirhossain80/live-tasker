import { useQuery } from '@tanstack/react-query'
import { ArrowUpDown, ClipboardList, FileText, ListFilter } from 'lucide-react'
import { getBoards } from '../../api/boards'
import { getTasks, type Task, type TaskPriority } from '../../api/tasks'
import { getWorkspaces } from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import MyTasksStats from '../../components/tasks/MyTasksStats'
import MyTasksTable from '../../components/tasks/MyTasksTable'
import type { MyTask } from '../../components/tasks/MyTasksTableRow'
import type { TaskPriority as UiTaskPriority } from '../../components/tasks/TaskPriorityBadge'

const tabs = ['All Tasks', 'Today', 'Upcoming', 'Completed']

const priorityLabels: Record<TaskPriority, UiTaskPriority> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

function formatDueDate(dueDate?: string) {
  if (!dueDate) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dueDate))
}

function getBoardName(task: Task, fallback: string) {
  return typeof task.board === 'string' ? fallback : task.board.name
}

function getStatusTitle(task: Task, columns: { _id: string; title: string }[]) {
  return columns.find((column) => column._id === task.status)?.title || 'Unknown'
}

function mapTasks(tasks: Task[], boardName: string, columns: { _id: string; title: string }[]): MyTask[] {
  return tasks.map((task) => ({
    id: task._id,
    title: task.title,
    project: getBoardName(task, boardName),
    dueDate: formatDueDate(task.dueDate),
    status: getStatusTitle(task, columns),
    priority: priorityLabels[task.priority],
    icon: FileText,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  }))
}

function MyTasks() {
  const {
    data: workspaces,
    isLoading: areWorkspacesLoading,
    isError: isWorkspacesError,
    error: workspacesError,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  const selectedWorkspaceId = workspaces?.[0]?._id
  const {
    data: boards,
    isLoading: areBoardsLoading,
    isError: isBoardsError,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery({
    queryKey: ['boards', selectedWorkspaceId],
    queryFn: () => getBoards(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })

  const selectedBoard = boards?.[0]
  const {
    data: backendTasks = [],
    isLoading: areTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', selectedBoard?._id],
    queryFn: () => getTasks(selectedBoard?._id as string),
    enabled: Boolean(selectedBoard?._id),
  })

  const isLoading = areWorkspacesLoading || areBoardsLoading || areTasksLoading
  const hasError = isWorkspacesError || isBoardsError || isTasksError
  const error = workspacesError || boardsError || tasksError

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <LoadingState title="Loading tasks" message="Fetching tasks from your current board." />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="mx-auto max-w-7xl">
        <ErrorState
          title="Could not load tasks"
          message={error instanceof Error ? error.message : 'Please try again in a moment.'}
          onRetry={() => {
            if (isWorkspacesError) {
              void refetchWorkspaces()
            } else if (isBoardsError) {
              void refetchBoards()
            } else {
              void refetchTasks()
            }
          }}
        />
      </div>
    )
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <EmptyState
          icon={ClipboardList}
          title="No workspace tasks yet"
          message="Create a workspace and board before tasks can appear here."
        />
      </div>
    )
  }

  if (!selectedBoard) {
    return (
      <div className="mx-auto max-w-7xl">
        <EmptyState
          icon={ClipboardList}
          title="No board tasks yet"
          message="The backend currently lists tasks by board. Create a board in this workspace to show tasks here."
        />
      </div>
    )
  }

  const tasks = mapTasks(backendTasks, selectedBoard.name, selectedBoard.columns)
  const inProgressTasks = tasks.filter((task) => task.status.toLowerCase().includes('progress')).length
  const completedTasks = tasks.filter((task) => task.status.toLowerCase() === 'done').length

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">My Tasks</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage and track your active task items in real-time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ListFilter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
        </div>
      </section>

      <MyTasksStats totalTasks={tasks.length} inProgressTasks={inProgressTasks} completedTasks={completedTasks} />

      <section className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition ${
              index === 0 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {tasks.length > 0 ? (
        <MyTasksTable tasks={tasks} />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No tasks on this board"
          message="Tasks from the first board in your first workspace will appear here until a user-specific task endpoint exists."
        />
      )}
    </div>
  )
}

export default MyTasks
