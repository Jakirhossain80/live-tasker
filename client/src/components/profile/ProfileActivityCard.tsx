import { MessageSquareText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import EmptyState from '../common/EmptyState'

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
  onViewAll: () => void
}

function ProfileActivityCard({ activities, onViewAll }: ProfileActivityCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-950">Recent Activity</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          View All
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="px-5 py-5">
          <EmptyState
            icon={MessageSquareText}
            title="No recent activity"
            message="Workspace activity connected to your profile will appear here."
            className="border-0 shadow-none"
          />
        </div>
      ) : (
        <ul className="px-5 py-5">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            const showConnector = index < activities.length - 1

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
      )}
    </section>
  )
}

export default ProfileActivityCard
