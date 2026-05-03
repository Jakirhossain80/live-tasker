import type { ReactNode } from 'react'

type TaskCardProps = {
  title: string
  description: string
  label: string
  due: string
  icon: ReactNode
  iconClassName: string
  comments?: string
}

function TaskCard({
  title,
  description,
  label,
  due,
  icon,
  iconClassName,
  comments,
}: TaskCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-950">{title}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{label}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{due}</span>
            {comments ? (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{comments}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export default TaskCard
