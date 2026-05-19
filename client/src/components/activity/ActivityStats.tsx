import { ClipboardPlus, ListChecks } from 'lucide-react'
import type { ActivityLog } from '../../api/activity'
import ActivityStatCard from './ActivityStatCard'
import LiveMonitoringCard from './LiveMonitoringCard'

type ActivityStatsProps = {
  activityLogs?: ActivityLog[]
}

function getRecordValue(log: ActivityLog, key: string) {
  return (log as unknown as Record<string, unknown>)[key]
}

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getActivityAction(log: ActivityLog) {
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

function getEntityType(log: ActivityLog) {
  const rawEntityType =
    getStringValue(log.entityType) ??
    getStringValue(getRecordValue(log, 'entity')) ??
    getStringValue(getRecordValue(log, 'resourceType')) ??
    getStringValue(getRecordValue(log, 'targetType'))

  return rawEntityType?.toLowerCase()
}

function getActivityDate(log: ActivityLog) {
  return getStringValue(getRecordValue(log, 'createdAt')) ?? getStringValue(getRecordValue(log, 'updatedAt'))
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

function isThisWeek(dateValue?: string) {
  if (!dateValue) {
    return false
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const today = new Date()
  const startOfWeek = new Date(today)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day

  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  return date >= startOfWeek
}

function getActorInitials(logs: ActivityLog[]) {
  const initials = logs
    .map((log) => {
      const actor = getRecordValue(log, 'actor') ?? getRecordValue(log, 'user')
      const actorName = getNamedValue(actor, ['name', 'fullName', 'username', 'email'])

      if (!actorName) {
        return undefined
      }

      return actorName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    })
    .filter((initial): initial is string => Boolean(initial))

  return Array.from(new Set(initials)).slice(0, 4)
}

function ActivityStats({ activityLogs = [] }: ActivityStatsProps) {
  const tasksCreated = activityLogs.filter((log) => getActivityAction(log) === 'created' && getEntityType(log) === 'task').length
  const completedLogs = activityLogs.filter((log) => getActivityAction(log) === 'completed')
  const completedThisWeek = completedLogs.filter((log) => isThisWeek(getActivityDate(log))).length
  const completedCount = completedLogs.length > 0 ? completedThisWeek : 0
  const liveStatus = activityLogs.length > 0 ? 'Activity Stream Live' : 'No Live Activity'
  const avatars = getActorInitials(activityLogs)
  const stats = [
    {
      label: 'Tasks Created',
      value: String(tasksCreated),
      badge: `${tasksCreated} total`,
      icon: ClipboardPlus,
      iconClassName: 'bg-indigo-50 text-indigo-600',
      badgeClassName: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Completed This Week',
      value: String(completedCount),
      badge: `${completedLogs.length} completed`,
      icon: ListChecks,
      iconClassName: 'bg-emerald-50 text-emerald-600',
      badgeClassName: 'bg-emerald-50 text-emerald-700',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <ActivityStatCard key={stat.label} {...stat} />
      ))}
      <LiveMonitoringCard status={liveStatus} avatars={avatars} />
    </section>
  )
}

export default ActivityStats
