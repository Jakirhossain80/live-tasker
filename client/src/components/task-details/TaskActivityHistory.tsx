import { Check, Edit3, MessageSquare, Paperclip, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityLog } from '../../api/activity'

type ActivityItem = {
  id: number | string
  text: string
  time: string
  icon: LucideIcon
  iconClassName: string
}

const activities: ActivityItem[] = [
  {
    id: 1,
    text: 'Sarah Chen marked as in progress',
    time: '2 hours ago',
    icon: Check,
    iconClassName: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    text: 'Marcus Wright attached 2 files',
    time: '5 hours ago',
    icon: Paperclip,
    iconClassName: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 3,
    text: 'Sarah Chen updated the description',
    time: 'Yesterday, 4:30 PM',
    icon: Edit3,
    iconClassName: 'bg-amber-100 text-amber-700',
  },
  {
    id: 4,
    text: 'System assigned to Sarah Chen',
    time: '2 days ago',
    icon: UserPlus,
    iconClassName: 'bg-slate-100 text-slate-700',
  },
]

type TaskActivityHistoryProps = {
  activities?: ActivityLog[]
  isLoading?: boolean
  errorMessage?: string
}

const activityStyles: Record<string, Pick<ActivityItem, 'icon' | 'iconClassName'>> = {
  created: {
    icon: UserPlus,
    iconClassName: 'bg-slate-100 text-slate-700',
  },
  updated: {
    icon: Edit3,
    iconClassName: 'bg-amber-100 text-amber-700',
  },
  moved: {
    icon: Check,
    iconClassName: 'bg-emerald-100 text-emerald-700',
  },
  commented: {
    icon: MessageSquare,
    iconClassName: 'bg-indigo-100 text-indigo-700',
  },
}

function formatActivityTime(createdAt: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

function mapActivity(activity: ActivityLog): ActivityItem {
  const style = activityStyles[activity.action] ?? {
    icon: Paperclip,
    iconClassName: 'bg-indigo-100 text-indigo-700',
  }

  return {
    id: activity._id,
    text: activity.message,
    time: formatActivityTime(activity.createdAt),
    ...style,
  }
}

function TaskActivityHistory({ activities: liveActivities, isLoading = false, errorMessage }: TaskActivityHistoryProps) {
  const hasLiveActivities = Array.isArray(liveActivities)
  const displayedActivities = hasLiveActivities ? liveActivities.map(mapActivity) : activities

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Activity History</h3>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm font-medium text-slate-500">Loading activity...</p>
        ) : errorMessage ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {errorMessage}
          </p>
        ) : displayedActivities.length === 0 ? (
          <p className="text-sm font-medium text-slate-500">No activity yet.</p>
        ) : (
          displayedActivities.map((activity, index) => {
            const Icon = activity.icon
            const isLast = index === displayedActivities.length - 1

            return (
              <article key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
                {!isLast && <span className="absolute left-4 top-9 h-[calc(100%-36px)] w-px bg-slate-200" />}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.iconClassName}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium leading-5 text-slate-700">{activity.text}</p>
                  <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                </div>
              </article>
            )
          })
        )}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      >
        View All Activity
      </button>
    </section>
  )
}

export default TaskActivityHistory
