import { CalendarDays, Image, MessageSquare, Pencil, Radio, Trash2 } from 'lucide-react'

type KanbanTaskCardProps = {
  status: string
  title: string
  description?: string
  priority: string
  dueDate?: string
  comments?: number
  live?: boolean
  hasImage?: boolean
  completed?: boolean
  priorityClassName: string
  columnOptions?: { id: string; title: string }[]
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onMove?: (status: string) => void
}

function KanbanTaskCard({
  status,
  title,
  description,
  priority,
  dueDate,
  comments,
  live,
  hasImage,
  completed,
  priorityClassName,
  columnOptions = [],
  onClick,
  onEdit,
  onDelete,
  onMove,
}: KanbanTaskCardProps) {
  return (
    <article
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md ${
        completed ? 'opacity-70 grayscale' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
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
          onClick={(event) => {
            event.stopPropagation()
            onEdit?.()
          }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
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

      {columnOptions.length > 0 ? (
        <label className="mt-4 block" onClick={(event) => event.stopPropagation()}>
          <span className="sr-only">Move task status</span>
          <select
            value={status}
            onChange={(event) => onMove?.(event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 outline-none transition hover:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          >
            {columnOptions.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </article>
  )
}

export default KanbanTaskCard
