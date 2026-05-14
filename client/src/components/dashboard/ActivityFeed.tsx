import { Link } from 'react-router-dom'

type ActivityItem = {
  id: string
  user: string
  action: string
  time: string
  quote?: string
}

type ActivityFeedProps = {
  activities: ActivityItem[]
  olderActivityHref?: string
}

function ActivityFeed({ activities, olderActivityHref = '/dashboard/activity' }: ActivityFeedProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Activity Feed</h2>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
              {activity.user
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </div>
            <div>
              <p className="text-sm text-slate-700">
                <span className="font-medium text-slate-950">{activity.user}</span> {activity.action}
              </p>
              {activity.quote ? (
                <blockquote className="mt-2 rounded-lg border-l-4 border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-slate-600">
                  "{activity.quote}"
                </blockquote>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to={olderActivityHref}
        className="mt-6 inline-flex w-full justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Load Older Activity
      </Link>
    </section>
  )
}

export default ActivityFeed
