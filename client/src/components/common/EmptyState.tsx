import { Plus, type LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

function EmptyState({ icon: Icon, title, message, actionLabel, onAction, className = '' }: EmptyStateProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>

      <div className="mx-auto mt-4 max-w-md">
        <h3 className="text-base font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      ) : null}
    </section>
  )
}

export default EmptyState
