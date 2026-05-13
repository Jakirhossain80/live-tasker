import { ClipboardPlus, ListChecks } from 'lucide-react'
import type { ActivityLog } from '../../api/activity'
import ActivityStatCard from './ActivityStatCard'
import LiveMonitoringCard from './LiveMonitoringCard'

type ActivityStatsProps = {
  activityLogs?: ActivityLog[]
}

function isThisWeek(dateValue: string) {
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
      if (typeof log.actor === 'string') {
        return undefined
      }

      return log.actor.name
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
  const tasksCreated = activityLogs.filter((log) => log.action === 'created' && log.entityType === 'task').length
  const completedLogs = activityLogs.filter((log) => log.action === 'completed')
  const completedThisWeek = completedLogs.filter((log) => isThisWeek(log.createdAt)).length
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
