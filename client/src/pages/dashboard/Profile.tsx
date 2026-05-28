import {
  Bell,
  Boxes,
  CirclePlus,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  MessageSquareText,
  MoveDown,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkspaceActivity, type ActivityAction, type ActivityLog } from '../../api/activity'
import { getBoards, isValidBoardId, type Board } from '../../api/boards'
import { getTasks, type Task, type TaskUser } from '../../api/tasks'
import { getWorkspaces } from '../../api/workspaces'
import CardSkeleton from '../../components/common/CardSkeleton'
import ErrorState from '../../components/common/ErrorState'
import ProfileActivityCard from '../../components/profile/ProfileActivityCard'
import ProfileHeader from '../../components/profile/ProfileHeader'
import ProfileInfoCard from '../../components/profile/ProfileInfoCard'
import ProfileQuickActions from '../../components/profile/ProfileQuickActions'
import ProfileStats from '../../components/profile/ProfileStats'
import { useAuthStore } from '../../store/auth.store'
import type { ProfileActivity } from '../../components/profile/ProfileActivityCard'
import type { ProfileHeaderData } from '../../components/profile/ProfileHeader'
import type { ProfileInfoItem } from '../../components/profile/ProfileInfoCard'
import type { ProfileQuickAction } from '../../components/profile/ProfileQuickActions'
import type { ProfileStat } from '../../components/profile/ProfileStats'

function getInitials(name?: string | null, email?: string | null) {
  const trimmedName = name?.trim()

  if (trimmedName) {
    const initials = trimmedName
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    if (initials) {
      return initials
    }
  }

  const trimmedEmail = email?.trim()

  if (trimmedEmail) {
    return trimmedEmail[0].toUpperCase()
  }

  return ''
}

const selectedWorkspaceStorageKey = 'livetasker:selectedWorkspaceId'

const quickActions: ProfileQuickAction[] = [
  { id: 'edit-profile', label: 'Edit Profile', icon: Pencil },
  { id: 'change-password', label: 'Change Password', icon: KeyRound },
  { id: 'manage-notifications', label: 'Manage Notifications', icon: Bell },
]

const activityStyles: Record<ActivityAction, Pick<ProfileActivity, 'icon' | 'iconClassName'>> = {
  created: {
    icon: CirclePlus,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  },
  updated: {
    icon: Pencil,
    iconClassName: 'bg-sky-50 text-sky-600',
  },
  deleted: {
    icon: Trash2,
    iconClassName: 'bg-rose-50 text-rose-600',
  },
  moved: {
    icon: MoveDown,
    iconClassName: 'bg-amber-50 text-amber-600',
  },
  commented: {
    icon: MessageSquareText,
    iconClassName: 'bg-violet-50 text-violet-600',
  },
  assigned: {
    icon: UserPlus,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
  completed: {
    icon: CheckCircle2,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  },
}

const defaultActivityStyle: Pick<ProfileActivity, 'icon' | 'iconClassName'> = {
  icon: MessageSquareText,
  iconClassName: 'bg-slate-100 text-slate-600',
}

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

function getUserId(user: TaskUser | string) {
  return typeof user === 'string' ? user : user._id
}

function isCompletedTask(task: Task, board: Board) {
  const doneColumn = board.columns.find((column) => column.title.toLowerCase() === 'done')

  return doneColumn ? task.status === doneColumn._id : task.status.toLowerCase() === 'done'
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

function getActivityActorId(log: ActivityLog) {
  const actor = getRecordValue(log, 'actor') ?? getRecordValue(log, 'user')

  return typeof actor === 'string' ? actor : getNamedValue(actor, ['_id', 'id'])
}

function getActivityActorName(log: ActivityLog) {
  const actor = getRecordValue(log, 'actor') ?? getRecordValue(log, 'user')

  return getNamedValue(actor, ['name', 'fullName', 'username', 'email']) ?? 'Workspace member'
}

function getActivityTime(log: ActivityLog) {
  return getStringValue(getRecordValue(log, 'createdAt')) ?? getStringValue(getRecordValue(log, 'updatedAt'))
}

function getActivityTimestamp(log: ActivityLog) {
  const activityTime = getActivityTime(log)
  const timestamp = activityTime ? new Date(activityTime).getTime() : Number.NaN

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function formatActivityTime(log: ActivityLog) {
  const activityTime = getActivityTime(log)

  if (!activityTime) {
    return 'Unknown time'
  }

  const timestamp = new Date(activityTime).getTime()

  if (Number.isNaN(timestamp)) {
    return 'Unknown time'
  }

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

function getActivityContext(log: ActivityLog) {
  const taskTitle = getNamedValue(getRecordValue(log, 'task'), ['title', 'name']) ?? getStringValue(getRecordValue(log, 'taskTitle'))

  if (taskTitle) {
    return taskTitle
  }

  return getNamedValue(getRecordValue(log, 'board'), ['name', 'title'])
}

function getActivityTitle(log: ActivityLog) {
  const message =
    getStringValue(getRecordValue(log, 'message')) ??
    getStringValue(getRecordValue(log, 'details')) ??
    getStringValue(getRecordValue(log, 'detail'))

  if (message) {
    return message
  }

  return `${getActivityActorName(log)} recorded workspace activity`
}

function mapProfileActivity(log: ActivityLog, index: number): ProfileActivity {
  const actionStyle = activityStyles[log.action] ?? defaultActivityStyle

  return {
    id: index,
    title: getActivityTitle(log),
    time: formatActivityTime(log),
    context: getActivityContext(log),
    ...actionStyle,
  }
}

function Profile() {
  const navigate = useNavigate()
  const [savedWorkspaceId] = useState(() => getSavedWorkspaceId())
  const user = useAuthStore((state) => state.user)
  const userId = user?.id

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
  const boardQueries = useQueries({
    queries: activeWorkspaces.map((workspace) => ({
      queryKey: ['boards', workspace._id],
      queryFn: () => getBoards(workspace._id),
    })),
  })
  const availableBoards = boardQueries
    .flatMap((query) => query.data ?? [])
    .filter((board) => !board.isArchived && board._id !== 'demo-board' && isValidBoardId(board._id))
  const taskQueries = useQueries({
    queries: availableBoards.map((board) => ({
      queryKey: ['tasks', board._id],
      queryFn: () => getTasks(board._id),
    })),
  })
  const tasksByBoard = availableBoards.map((board, index) => ({
    board,
    tasks: taskQueries[index]?.data?.filter((task) => !task.isArchived) ?? [],
  }))
  const areProfileStatsLoading =
    areWorkspacesLoading || boardQueries.some((query) => query.isLoading) || taskQueries.some((query) => query.isLoading)
  const isProfileStatsError =
    isWorkspacesError || boardQueries.some((query) => query.isError) || taskQueries.some((query) => query.isError)
  const profileStatsError =
    workspacesError ?? boardQueries.find((query) => query.error)?.error ?? taskQueries.find((query) => query.error)?.error
  const profileTasks = tasksByBoard.flatMap(({ tasks }) => tasks)
  const hasProfileStatsData = activeWorkspaces.length > 0 || availableBoards.length > 0 || profileTasks.length > 0
  const assignedTasks = userId
    ? profileTasks.filter((task) => task.assignees.some((assignee) => getUserId(assignee) === userId)).length
    : 0
  const completedTasks = tasksByBoard.reduce(
    (total, { board, tasks }) => total + tasks.filter((task) => isCompletedTask(task, board)).length,
    0,
  )
  const profileStats: ProfileStat[] = hasProfileStatsData
    ? [
        {
          label: 'Assigned Tasks',
          value: String(assignedTasks),
          icon: ClipboardList,
          iconClassName: 'bg-indigo-50 text-indigo-600',
          hoverBorderClassName: 'hover:border-indigo-300',
        },
        {
          label: 'Completed Tasks',
          value: String(completedTasks),
          icon: CheckCircle2,
          iconClassName: 'bg-emerald-50 text-emerald-600',
          hoverBorderClassName: 'hover:border-emerald-300',
        },
        {
          label: 'Workspaces',
          value: String(activeWorkspaces.length),
          icon: Boxes,
          iconClassName: 'bg-amber-50 text-amber-600',
          hoverBorderClassName: 'hover:border-amber-300',
        },
      ]
    : []
  const {
    data: activityLogs = [],
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivity,
    isSuccess: isActivitySuccess,
  } = useQuery({
    queryKey: ['workspace-activity', selectedWorkspaceId],
    queryFn: () => getWorkspaceActivity(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })
  const userActivityLogs = userId ? activityLogs.filter((log) => getActivityActorId(log) === userId) : []
  const recentActivityLogs = (userActivityLogs.length > 0 ? userActivityLogs : activityLogs)
    .toSorted((firstLog, secondLog) => getActivityTimestamp(secondLog) - getActivityTimestamp(firstLog))
    .slice(0, 3)
  const profileActivities = recentActivityLogs.map(mapProfileActivity)
  const isProfileActivityLoading = areWorkspacesLoading || (Boolean(selectedWorkspaceId) && isActivityLoading)
  const isProfileActivityError = isWorkspacesError || isActivityError
  const profileActivityError = workspacesError ?? activityError
  const canShowProfileActivity = isActivitySuccess

  const profile: ProfileHeaderData = {
    name: user?.name,
    email: user?.email,
    initials: getInitials(user?.name, user?.email),
  }

  const profileDetails: ProfileInfoItem[] = [
    { label: 'Full Name', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Job Title' },
    { label: 'Timezone' },
    { label: 'Joined Date' },
    { label: 'Workspace Role' },
  ]

  function handleProfileSettingsNavigation() {
    navigate('/dashboard/settings')
  }

  function handleViewAllActivity() {
    navigate('/dashboard/activity')
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">My Profile</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          View your account information and recent workspace activity.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <ProfileHeader profile={profile} onEditProfile={handleProfileSettingsNavigation} />
          {areProfileStatsLoading ? (
            <section className="grid gap-4 md:grid-cols-3">
              <CardSkeleton rows={1} showAvatar={false} />
              <CardSkeleton rows={1} showAvatar={false} />
              <CardSkeleton rows={1} showAvatar={false} />
            </section>
          ) : isProfileStatsError ? (
            <ErrorState
              title="Could not load profile stats"
              message={profileStatsError instanceof Error ? profileStatsError.message : 'Please try again in a moment.'}
              onRetry={() => {
                if (isWorkspacesError) {
                  void refetchWorkspaces()
                }

                boardQueries.forEach((query) => {
                  if (query.isError) {
                    void query.refetch()
                  }
                })

                taskQueries.forEach((query) => {
                  if (query.isError) {
                    void query.refetch()
                  }
                })
              }}
            />
          ) : (
            <ProfileStats stats={profileStats} />
          )}
          {isProfileActivityLoading ? (
            <CardSkeleton rows={4} />
          ) : isProfileActivityError ? (
            <ErrorState
              title="Could not load recent activity"
              message={profileActivityError instanceof Error ? profileActivityError.message : 'Please try again in a moment.'}
              onRetry={() => {
                if (isWorkspacesError) {
                  void refetchWorkspaces()
                } else {
                  void refetchActivity()
                }
              }}
            />
          ) : canShowProfileActivity ? (
            <ProfileActivityCard activities={profileActivities} onViewAll={handleViewAllActivity} />
          ) : null}
        </div>

        <aside className="space-y-6">
          <ProfileInfoCard details={profileDetails} />
          <ProfileQuickActions actions={quickActions} onActionClick={handleProfileSettingsNavigation} />
        </aside>
      </section>
    </div>
  )
}

export default Profile
