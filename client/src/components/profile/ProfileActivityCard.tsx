import { CheckCircle2, MessageSquareText, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ProfileActivity = {
  id: number
  title: string
  time: string
  context?: string
  icon: LucideIcon
  iconClassName: string
}

type ProfileActivityCardProps = {
  activities: ProfileActivity[]
}

function ProfileActivityCard({ activities }: ProfileActivityCardProps) {
  const fallbackActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: 1,
            title: "Completed 'UI Dashboard Redesign'",
            time: '2 hours ago',
            context: 'Product Design Workspace',
            icon: CheckCircle2,
            iconClassName: 'bg-emerald-50 text-emerald-600',
          },
          {
            id: 2,
            title: "Joined 'Marketing Workspace'",
            time: 'Yesterday at 4:30 PM',
            icon: UserPlus,
            iconClassName: 'bg-indigo-50 text-indigo-600',
          },
          {
            id: 3,
            title: "Commented on 'Sprint Planning Board'",
            time: 'Oct 12, 2023',
            context: 'Engineering Team',
            icon: MessageSquareText,
            iconClassName: 'bg-amber-50 text-amber-600',
          },
        ]

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-950">Recent Activity</h3>
        <button
          type="button"
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          View All
        </button>
      </div>

      <ul className="px-5 py-5">
        {fallbackActivities.map((activity, index) => {
          const Icon = activity.icon
          const showConnector = index < fallbackActivities.length - 1

          return (
            <li key={activity.id} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
              <div className="relative flex justify-center">
                {showConnector ? (
                  <span
                    className="absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-slate-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className={`min-w-0 ${showConnector ? 'pb-5' : ''}`}>
                <h4 className="break-words text-sm font-semibold text-slate-950">{activity.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span>{activity.time}</span>
                  {activity.context ? <span className="break-words">{activity.context}</span> : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ProfileActivityCard
