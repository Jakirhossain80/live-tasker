import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CalendarDays, CheckCircle2, ClipboardList, Clock3, Palette, Plus, Rocket, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getWorkspaceActivity, type ActivityLog } from '../../api/activity'
import { getBoards } from '../../api/boards'
import { getTasks, type Task } from '../../api/tasks'
import { getWorkspaces } from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import StatsCard from '../../components/dashboard/StatsCard'
import TaskCard from '../../components/dashboard/TaskCard'
import UpgradeCard from '../../components/dashboard/UpgradeCard'
import { useSocket } from '../../hooks/useSocket'
import { useAuthStore } from '../../store/auth.store'

const dashboardRealtimeEvents = ['taskCreated', 'taskUpdated', 'taskMoved', 'commentAdded'] as const

function getTaskStatusLabel(task: Task, columns: { _id: string; title: string }[]) {
  const statusColumn = columns.find((column) => column._id === task.status)

  return statusColumn?.title || task.status
}

function isCompletedTask(task: Task, columns: { _id: string; title: string }[]) {
  const status = getTaskStatusLabel(task, columns).toLowerCase()

  return ['done', 'completed', 'complete'].includes(status)
}

function isInProgressTask(task: Task, columns: { _id: string; title: string }[]) {
  const status = getTaskStatusLabel(task, columns).toLowerCase()

  return status.includes('progress') || status === 'doing' || status === 'active'
}

function formatDueDate(dueDate?: string) {
  if (!dueDate) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dueDate))
}

function formatActivityTime(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()
  const diffInMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))

  if (diffInMinutes < 1) {
    return 'Just now'
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)

  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
}

function getActivityActorName(activity: ActivityLog) {
  return typeof activity.actor === 'string' ? 'System' : activity.actor.name
}

function getTaskSortTimestamp(task: Task) {
  return new Date(task.updatedAt || task.createdAt).getTime()
}

function getActivitySortTimestamp(activity: ActivityLog) {
  return new Date(activity.updatedAt || activity.createdAt).getTime()
}

function getStats(tasks: Task[], columns: { _id: string; title: string }[]) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => isCompletedTask(task, columns)).length
  const inProgressTasks = tasks.filter((task) => isInProgressTask(task, columns)).length

  return [
    {
      title: 'Total Tasks',
      value: totalTasks,
      badge: 'Live',
      icon: <ClipboardList className="h-6 w-6 text-indigo-600" />,
      accentClassName: 'bg-indigo-50',
      badgeClassName: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Completed',
      value: completedTasks,
      badge: 'Live',
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
      accentClassName: 'bg-emerald-50',
      badgeClassName: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      badge: 'Live',
      icon: <Clock3 className="h-6 w-6 text-amber-600" />,
      accentClassName: 'bg-amber-50',
      badgeClassName: 'bg-amber-50 text-amber-700',
    },
  ]
}

function DashboardHome() {
  const queryClient = useQueryClient()
  const { socket, isConnected } = useSocket()
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name || user?.email?.split('@')[0] || 'there'
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

  const selectedWorkspace = workspaces?.[0]
  const selectedWorkspaceId = selectedWorkspace?._id
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
  const selectedBoardId = selectedBoard?._id
  const {
    data: backendTasks = [],
    isLoading: areTasksLoading,
    isError: isTasksError,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', selectedBoardId],
    queryFn: () => getTasks(selectedBoardId as string),
    enabled: Boolean(selectedBoardId),
  })

  const {
    data: workspaceActivity = [],
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: ['workspace-activity', selectedWorkspaceId],
    queryFn: () => getWorkspaceActivity(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })

  const isLoading = areWorkspacesLoading || areBoardsLoading || areTasksLoading || isActivityLoading
  const hasError = isWorkspacesError || isBoardsError || isTasksError || isActivityError
  const error = workspacesError || boardsError || tasksError || activityError

  useEffect(() => {
    if (!selectedWorkspaceId && !selectedBoardId) {
      return
    }

    function joinDashboardRooms() {
      if (selectedWorkspaceId) {
        socket.emit('joinWorkspace', { workspaceId: selectedWorkspaceId })
      }

      if (selectedBoardId) {
        socket.emit('joinBoard', { boardId: selectedBoardId })
      }
    }

    function refreshDashboardQueries() {
      if (selectedBoardId) {
        void queryClient.invalidateQueries({ queryKey: ['tasks', selectedBoardId] })
      }

      if (selectedWorkspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['workspace-activity', selectedWorkspaceId] })
      }
    }

    socket.on('connect', joinDashboardRooms)
    dashboardRealtimeEvents.forEach((eventName) => {
      socket.on(eventName, refreshDashboardQueries)
    })

    if (isConnected || socket.connected) {
      joinDashboardRooms()
    }

    return () => {
      socket.off('connect', joinDashboardRooms)
      dashboardRealtimeEvents.forEach((eventName) => {
        socket.off(eventName, refreshDashboardQueries)
      })

      if (socket.connected) {
        if (selectedWorkspaceId) {
          socket.emit('leaveWorkspace', { workspaceId: selectedWorkspaceId })
        }

        if (selectedBoardId) {
          socket.emit('leaveBoard', { boardId: selectedBoardId })
        }
      }
    }
  }, [isConnected, queryClient, selectedBoardId, selectedWorkspaceId, socket])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <LoadingState title="Loading dashboard" message="Fetching your workspace dashboard data." />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="mx-auto max-w-7xl">
        <ErrorState
          title="Could not load dashboard"
          message={error instanceof Error ? error.message : 'Please try again in a moment.'}
          onRetry={() => {
            if (isWorkspacesError) {
              void refetchWorkspaces()
            } else if (isBoardsError) {
              void refetchBoards()
            } else if (isTasksError) {
              void refetchTasks()
            } else {
              void refetchActivity()
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
          title="No workspace yet"
          message="Create a workspace before dashboard tasks and activity can appear here."
        />
      </div>
    )
  }

  const boardColumns = selectedBoard?.columns ?? []
  const stats = getStats(backendTasks, boardColumns)
  const recentTasks = [...backendTasks]
    .sort((firstTask, secondTask) => getTaskSortTimestamp(secondTask) - getTaskSortTimestamp(firstTask))
    .slice(0, 3)
    .map((task, index) => ({
      id: task._id,
      title: task.title,
      description: task.description || 'No description provided.',
      label: task.labels[0] || task.priority,
      due: formatDueDate(task.dueDate),
      icon:
        index === 0 ? (
          <Rocket className="h-5 w-5 text-indigo-600" />
        ) : index === 1 ? (
          <Terminal className="h-5 w-5 text-emerald-600" />
        ) : (
          <Palette className="h-5 w-5 text-rose-600" />
        ),
      iconClassName: index === 0 ? 'bg-indigo-50' : index === 1 ? 'bg-emerald-50' : 'bg-rose-50',
    }))
  const activities = [...workspaceActivity]
    .sort((firstActivity, secondActivity) => getActivitySortTimestamp(secondActivity) - getActivitySortTimestamp(firstActivity))
    .slice(0, 3)
    .map((activity) => ({
      id: activity._id,
      user: getActivityActorName(activity),
      action: activity.message || `${activity.action} ${activity.entityType}`,
      time: formatActivityTime(activity.createdAt),
    }))

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Welcome back, {displayName}</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm text-slate-500">You have 4 tasks to complete today.</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <CalendarDays className="h-4 w-4" />
          This Week
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            badge={stat.badge}
            icon={stat.icon}
            accentClassName={stat.accentClassName}
            badgeClassName={stat.badgeClassName}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent Tasks</h2>
            </div>
            <Link
              to="/dashboard/my-tasks"
              className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  taskId={task.id}
                  title={task.title}
                  description={task.description}
                  label={task.label}
                  due={task.due}
                  icon={task.icon}
                  iconClassName={task.iconClassName}
                />
              ))
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No recent tasks"
                message="Tasks from the first board in your workspace will appear here."
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {activities.length > 0 ? (
            <ActivityFeed activities={activities} />
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No recent activity"
              message="Workspace activity will appear here after tasks, boards, or comments change."
            />
          )}
          <UpgradeCard />
        </div>
      </section>

      {selectedBoardId ? (
        <Link
          to={`/dashboard/boards/${selectedBoardId}`}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl"
          aria-label="Create new task"
        >
          <Plus className="h-6 w-6" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="Create a board before adding tasks."
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-full bg-indigo-600 text-white opacity-60 shadow-lg shadow-indigo-600/25"
          aria-label="Create a board before adding tasks"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

export default DashboardHome
