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
import { useEffect, useMemo, useState } from 'react'
import { getWorkspaceActivity, type ActivityAction, type ActivityLog } from '../../api/activity'
import { getWorkspaces } from '../../api/workspaces'
import ActivityStats from '../../components/activity/ActivityStats'
import ActivityTimeline, { type TimelineGroup } from '../../components/activity/ActivityTimeline'
import type { TimelineItem } from '../../components/activity/ActivityTimelineItem'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import { connectSocket, disconnectSocket, socket } from '../../socket/socket'

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

const defaultActionStyle: Pick<TimelineItem, 'icon' | 'iconClassName' | 'hoverBorderClassName'> = {
  icon: ActivityIcon,
  iconClassName: 'bg-slate-100 text-slate-600',
  hoverBorderClassName: 'hover:border-slate-300',
}

function getRecordValue(log: ActivityLog, key: string) {
  return (log as unknown as Record<string, unknown>)[key]
}

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getNamedValue(value: unknown, keys: string[]) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const record = value as Record<string, unknown>

  for (const key of keys) {
    const stringValue = getStringValue(record[key])

    if (stringValue) {
      return stringValue
    }
  }

  return undefined
}

function formatUnknownAction(action?: string) {
  if (!action) {
    return undefined
  }

  return action
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ')
}

function getActivityAction(log: ActivityLog): ActivityAction | undefined {
  const rawAction = getStringValue(log.action) ?? getStringValue(getRecordValue(log, 'type'))
  const normalizedAction = rawAction?.toLowerCase().replace(/[_-]+/g, ' ')

  if (!normalizedAction) {
    return undefined
  }

  if (normalizedAction.includes('comment')) return 'commented'
  if (normalizedAction.includes('assign')) return 'assigned'
  if (normalizedAction.includes('complete')) return 'completed'
  if (normalizedAction.includes('move')) return 'moved'
  if (normalizedAction.includes('delete') || normalizedAction.includes('remove')) return 'deleted'
  if (normalizedAction.includes('update') || normalizedAction.includes('edit')) return 'updated'
  if (normalizedAction.includes('create') || normalizedAction.includes('add')) return 'created'

  return undefined
}

function getActionLabel(log: ActivityLog) {
  const action = getActivityAction(log)

  return action ? actionLabels[action] : formatUnknownAction(getStringValue(log.action) ?? getStringValue(getRecordValue(log, 'type'))) ?? 'Activity'
}

function getActorName(log: ActivityLog) {
  const actor = getRecordValue(log, 'actor') ?? getRecordValue(log, 'user')
  const actorName = getNamedValue(actor, ['name', 'fullName', 'username', 'email'])

  return actorName ?? 'Workspace member'
}

function getTaskTitle(log: ActivityLog) {
  return getNamedValue(getRecordValue(log, 'task'), ['title', 'name']) ?? getStringValue(getRecordValue(log, 'taskTitle'))
}

function getProjectLabel(log: ActivityLog) {
  const taskTitle = getTaskTitle(log)

  if (taskTitle) {
    return `Task: ${taskTitle}`
  }

  const boardName = getNamedValue(getRecordValue(log, 'board'), ['name', 'title'])

  if (boardName) {
    return `Board: ${boardName}`
  }

  const workspaceName = getNamedValue(getRecordValue(log, 'workspace'), ['name', 'title'])

  if (workspaceName) {
    return `Workspace: ${workspaceName}`
  }

  return getActionLabel(log)
}

function getStringMetadata(log: ActivityLog, key: string) {
  const metadata = getRecordValue(log, 'metadata')
  const value = metadata && typeof metadata === 'object' ? (metadata as Record<string, unknown>)[key] : undefined

  return typeof value === 'string' && value.trim() ? value : undefined
}

function getDescription(log: ActivityLog) {
  const commentPreview = getStringMetadata(log, 'commentPreview')

  if (commentPreview) {
    return commentPreview
  }

  const taskTitle = getTaskTitle(log)
  const boardName = getNamedValue(getRecordValue(log, 'board'), ['name', 'title'])
  const details =
    getStringValue(getRecordValue(log, 'details')) ??
    getStringValue(getRecordValue(log, 'detail')) ??
    getStringValue(getRecordValue(log, 'description'))

  if (details) {
    return details
  }

  const action = getActivityAction(log)

  if (action === 'moved') {
    return taskTitle
      ? `Task status changed for ${taskTitle}.`
      : 'Task status changed in this workspace.'
  }

  if (action === 'updated') {
    return taskTitle ? `Task details were updated for ${taskTitle}.` : 'Activity details were updated.'
  }

  if (boardName) {
    return `Recorded in ${boardName}.`
  }

  return 'Workspace activity was recorded.'
}

function getTransition(log: ActivityLog) {
  if (getActivityAction(log) !== 'moved') {
    return undefined
  }

  const from = getStringMetadata(log, 'previousStatus')
  const to = getStringMetadata(log, 'currentStatus')

  if (!from || !to || from === to) {
    return undefined
  }

  return { from, to }
}

function getActivityDate(log: ActivityLog) {
  return getStringValue(getRecordValue(log, 'createdAt')) ?? getStringValue(getRecordValue(log, 'updatedAt'))
}

function formatTime(createdAt?: string) {
  if (!createdAt) {
    return 'Unknown time'
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatGroupDate(createdAt?: string) {
  if (!createdAt) {
    return 'Recent activity'
  }

  const activityDate = new Date(createdAt)

  if (Number.isNaN(activityDate.getTime())) {
    return 'Recent activity'
  }

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

function getActivityId(log: ActivityLog, index: number) {
  return (
    getStringValue(getRecordValue(log, '_id')) ??
    getStringValue(getRecordValue(log, 'id')) ??
    getStringValue(getRecordValue(log, 'entityId')) ??
    `activity-${index}`
  )
}

function getActivityMessage(log: ActivityLog) {
  return (
    getStringValue(getRecordValue(log, 'message')) ??
    getStringValue(getRecordValue(log, 'details')) ??
    getStringValue(getRecordValue(log, 'detail')) ??
    `${getActionLabel(log)} activity was recorded`
  )
}

function mapActivityLog(log: ActivityLog, index: number): TimelineItem {
  const actor = getActorName(log)
  const action = getActivityAction(log)
  const actionStyle = action ? actionStyles[action] : defaultActionStyle
  const createdAt = getActivityDate(log)

  return {
    id: getActivityId(log, index),
    title: `${actor}: ${getActivityMessage(log)}`,
    description: getDescription(log),
    actor,
    time: formatTime(createdAt),
    project: getProjectLabel(log),
    status: getActionLabel(log),
    transition: getTransition(log),
    isDetailItalic: action === 'commented',
    ...actionStyle,
  }
}

function mapActivityGroups(activityLogs: ActivityLog[]): TimelineGroup[] {
  const groupMap = new Map<string, TimelineItem[]>()

  activityLogs.forEach((log, index) => {
    const groupDate = formatGroupDate(getActivityDate(log))
    const groupItems = groupMap.get(groupDate) ?? []

    groupItems.push(mapActivityLog(log, index))
    groupMap.set(groupDate, groupItems)
  })

  return Array.from(groupMap, ([date, items]) => ({ date, items }))
}

function Activity() {
  const queryClient = useQueryClient()
  const [savedWorkspaceId] = useState(() => getSavedWorkspaceId())
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

  const activeWorkspaces = useMemo(() => workspaces?.filter((workspace) => !workspace.isArchived) ?? [], [workspaces])
  const selectedWorkspace = useMemo(
    () => activeWorkspaces.find((workspace) => workspace._id === savedWorkspaceId) ?? activeWorkspaces[0],
    [activeWorkspaces, savedWorkspaceId],
  )
  const selectedWorkspaceId = selectedWorkspace?._id
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
