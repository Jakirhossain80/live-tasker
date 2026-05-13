import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type TimelineItem = {
  id: string
  title: string
  description: string
  actor: string
  time: string
  project: string
  icon: LucideIcon
  iconClassName: string
  hoverBorderClassName: string
  status?: string
  isDetailItalic?: boolean
  transition?: {
    from: string
    to: string
  }
  assignee?: string
}

type ActivityTimelineItemProps = {
  item: TimelineItem
  showConnector?: boolean
}

function ActivityTimelineItem({ item, showConnector = true }: ActivityTimelineItemProps) {
  const Icon = item.icon

  return (
    <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4">
      <div className="relative flex justify-center">
        {showConnector ? (
          <span className="absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-slate-200" aria-hidden="true" />
        ) : null}
        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${item.iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="min-w-0 pb-5">
        <div
          className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors sm:p-5 ${item.hoverBorderClassName}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words text-sm font-semibold text-slate-950">{item.title}</h3>
              <p className={`mt-1 break-words text-sm leading-6 text-slate-600 ${item.isDetailItalic ? 'italic' : ''}`}>
                {item.description}
              </p>
              {item.transition ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{item.transition.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{item.transition.to}</span>
                </div>
              ) : null}
              {item.assignee ? (
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {item.assignee}
                  </span>
                </div>
              ) : null}
            </div>
            {item.status ? (
              <span className="w-fit shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {item.status}
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
            <span className="break-words">{item.actor}</span>
            <span className="break-words">{item.project}</span>
            <span className="shrink-0">{item.time}</span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default ActivityTimelineItem
