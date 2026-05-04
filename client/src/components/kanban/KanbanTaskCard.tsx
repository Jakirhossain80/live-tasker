import { CalendarDays, Image, MessageSquare, MoreHorizontal, Radio } from 'lucide-react'

type KanbanTaskCardProps = {
  title: string
  description?: string
  priority: string
  dueDate?: string
  comments?: number
  live?: boolean
  hasImage?: boolean
  completed?: boolean
  priorityClassName: string
}

function KanbanTaskCard({
  title,
  description,
  priority,
  dueDate,
  comments,
  live,
  hasImage,
  completed,
  priorityClassName,
}: KanbanTaskCardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md ${
        completed ? 'opacity-70 grayscale' : ''
      }`}
    >
      {hasImage ? (
        <div className="mb-4 flex aspect-[16/9] items-center justify-center rounded-lg border border-slate-200 bg-indigo-50 text-indigo-500">
          <Image className="h-8 w-8" />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassName}`}>
          {priority}
        </span>
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          aria-label={`More options for ${title}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <h3 className={`mt-3 text-sm font-semibold leading-6 text-slate-950 ${completed ? 'line-through' : ''}`}>
        {title}
      </h3>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
        {dueDate ? (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {dueDate}
          </span>
        ) : null}
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
            <Radio className="h-3.5 w-3.5" />
            Live
          </span>
        ) : null}
        {typeof comments === 'number' ? (
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {comments}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export default KanbanTaskCard
