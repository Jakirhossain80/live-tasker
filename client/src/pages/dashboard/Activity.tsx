import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Activity as ActivityIcon,
  BadgePlus,
  CalendarDays,
  CheckCircle,
  MessageSquare,
  MoveDown,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { useEffect } from 'react'
import { getWorkspaceActivity, type ActivityAction, type ActivityLog } from '../../api/activity'
import { getWorkspaces } from '../../api/workspaces'
import ActivityStats from '../../components/activity/ActivityStats'
import ActivityTimeline, { type TimelineGroup } from '../../components/activity/ActivityTimeline'
import type { TimelineItem } from '../../components/activity/ActivityTimelineItem'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import { connectSocket, disconnectSocket, socket } from '../../socket/socket'

const actionLabels: Record<ActivityAction, string> = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  moved: 'Moved',
  commented: 'Commented',
  assigned: 'Assigned',
  completed: 'Completed',
}

const actionStyles: Record<ActivityAction, Pick<TimelineItem, 'icon' | 'iconClassName' | 'hoverBorderClassName'>> = {
  created: {
    icon: BadgePlus,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    hoverBorderClassName: 'hover:border-indigo-300',
  },
  updated: {
    icon: Pencil,
    iconClassName: 'bg-sky-50 text-sky-600',
    hoverBorderClassName: 'hover:border-sky-300',
  },
  deleted: {
    icon: Trash2,
    iconClassName: 'bg-rose-50 text-rose-600',
    hoverBorderClassName: 'hover:border-rose-300',
  },
  moved: {
    icon: MoveDown,
    iconClassName: 'bg-amber-50 text-amber-600',
    hoverBorderClassName: 'hover:border-amber-300',
  },
  commented: {
    icon: MessageSquare,
    iconClassName: 'bg-violet-50 text-violet-600',
    hoverBorderClassName: 'hover:border-violet-300',
  },
  assigned: {
    icon: UserPlus,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    hoverBorderClassName: 'hover:border-emerald-300',
  },
  completed: {
    icon: CheckCircle,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    hoverBorderClassName: 'hover:border-indigo-300',
  },
}

function getActorName(log: ActivityLog) {
  return typeof log.actor === 'string' ? 'Workspace member' : log.actor.name
}

function getTaskTitle(log: ActivityLog) {
  return typeof log.task === 'object' && log.task ? log.task.title : undefined
}

function getProjectLabel(log: ActivityLog) {
  const taskTitle = getTaskTitle(log)

  if (taskTitle) {
    return `Task: ${taskTitle}`
  }

  if (typeof log.board === 'object' && log.board) {
    return `Board: ${log.board.name}`
  }

  return actionLabels[log.action]
}

function getStringMetadata(log: ActivityLog, key: string) {
  const value = log.metadata?.[key]

  return typeof value === 'string' && value.trim() ? value : undefined
}

function getDescription(log: ActivityLog) {
  const commentPreview = getStringMetadata(log, 'commentPreview')

  if (commentPreview) {
    return commentPreview
  }

  const taskTitle = getTaskTitle(log)
  const boardName = typeof log.board === 'object' && log.board ? log.board.name : undefined

  if (log.action === 'moved') {
    return taskTitle
      ? `Task status changed for ${taskTitle}.`
      : 'Task status changed in this workspace.'
  }

  if (log.action === 'updated') {
    return taskTitle ? `Task details were updated for ${taskTitle}.` : 'Activity details were updated.'
  }

  if (boardName) {
    return `Recorded in ${boardName}.`
  }

  return 'Workspace activity was recorded.'
}

function getTransition(log: ActivityLog) {
  if (log.action !== 'moved') {
    return undefined
  }

  const from = getStringMetadata(log, 'previousStatus')
  const to = getStringMetadata(log, 'currentStatus')

  if (!from || !to || from === to) {
    return undefined
  }

  return { from, to }
}

function formatTime(createdAt: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

function formatGroupDate(createdAt: string) {
  const activityDate = new Date(createdAt)
  const today = new Date()
  const yesterday = new Date()

  yesterday.setDate(today.getDate() - 1)

  if (activityDate.toDateString() === today.toDateString()) {
    return `Today, ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(activityDate)}`
  }

  if (activityDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(activityDate)}`
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(activityDate)
}

function mapActivityLog(log: ActivityLog): TimelineItem {
  const actor = getActorName(log)

  return {
    id: log._id,
    title: `${actor}: ${log.message}`,
    description: getDescription(log),
    actor,
    time: formatTime(log.createdAt),
    project: getProjectLabel(log),
    status: actionLabels[log.action],
    transition: getTransition(log),
    isDetailItalic: log.action === 'commented',
    ...actionStyles[log.action],
  }
}

function mapActivityGroups(activityLogs: ActivityLog[]): TimelineGroup[] {
  const groupMap = new Map<string, TimelineItem[]>()

  activityLogs.forEach((log) => {
    const groupDate = formatGroupDate(log.createdAt)
    const groupItems = groupMap.get(groupDate) ?? []

    groupItems.push(mapActivityLog(log))
    groupMap.set(groupDate, groupItems)
  })

  return Array.from(groupMap, ([date, items]) => ({ date, items }))
}

function Activity() {
  const queryClient = useQueryClient()
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
    data: activityLogs = [],
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: ['workspace-activity', selectedWorkspaceId],
    queryFn: () => getWorkspaceActivity(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })

  const isLoading = areWorkspacesLoading || isActivityLoading
  const hasError = isWorkspacesError || isActivityError
  const error = workspacesError || activityError
  const timelineGroups = mapActivityGroups(activityLogs)

  useEffect(() => {
    if (!selectedWorkspaceId) {
      return
    }

    const activityQueryKey = ['workspace-activity', selectedWorkspaceId]

    function joinCurrentWorkspace() {
      socket.emit('joinWorkspace', { workspaceId: selectedWorkspaceId })
    }

    function refreshActivity() {
      void queryClient.invalidateQueries({ queryKey: activityQueryKey })
    }

    const activityEvents = ['activityCreated', 'taskCreated', 'taskUpdated', 'taskMoved', 'commentAdded'] as const

    socket.on('connect', joinCurrentWorkspace)
    activityEvents.forEach((eventName) => {
      socket.on(eventName, refreshActivity)
    })

    connectSocket()

    if (socket.connected) {
      joinCurrentWorkspace()
    }

    return () => {
      socket.off('connect', joinCurrentWorkspace)
      activityEvents.forEach((eventName) => {
        socket.off(eventName, refreshActivity)
      })
      disconnectSocket()
    }
  }, [queryClient, selectedWorkspaceId])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Activity Timeline</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Real-time update stream for all workspace movements and task transitions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <CalendarDays className="h-4 w-4" />
            Today
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </section>

      <ActivityStats activityLogs={activityLogs} />

      <section>
        {isLoading ? (
          <LoadingState title="Loading activity" message="Fetching recent workspace activity." />
        ) : hasError ? (
          <ErrorState
            title="Could not load activity"
            message={error instanceof Error ? error.message : 'Please try again in a moment.'}
            onRetry={() => {
              if (isWorkspacesError) {
                void refetchWorkspaces()
              } else {
                void refetchActivity()
              }
            }}
          />
        ) : !selectedWorkspaceId ? (
          <EmptyState
            icon={ActivityIcon}
            title="No workspace selected"
            message="Create or join a workspace before activity can appear here."
          />
        ) : activityLogs.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            message="Workspace task updates, moves, and comments will appear here."
          />
        ) : (
          <ActivityTimeline groups={timelineGroups} />
        )}
      </section>
    </div>
  )
}

export default Activity
