import ActivityTimelineItem from './ActivityTimelineItem'
import type { TimelineItem } from './ActivityTimelineItem'
import { History } from 'lucide-react'

export type TimelineGroup = {
  date: string
  items: TimelineItem[]
}

type ActivityTimelineProps = {
  groups: TimelineGroup[]
}

function ActivityTimeline({ groups }: ActivityTimelineProps) {
  const totalItems = groups.reduce((count, group) => count + group.items.length, 0)

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Activity Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Latest task, board, and workspace events.</p>
        </div>
        <button
          type="button"
          className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"
        >
          View All
        </button>
      </div>

      <div className="space-y-2">
        {groups.map((group, groupIndex) => (
          <div key={group.date}>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <p className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">{group.date}</p>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <ol>
              {group.items.map((item, itemIndex) => {
                const previousGroupItems = groups
                  .slice(0, groupIndex)
                  .reduce((count, previousGroup) => count + previousGroup.items.length, 0)
                const renderedItems = previousGroupItems + itemIndex + 1

                return <ActivityTimelineItem key={item.id} item={item} showConnector={renderedItems < totalItems} />
              })}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <History className="h-4 w-4" />
          Load older activity
        </button>
      </div>
    </section>
  )
}

export default ActivityTimeline
