import { Plus } from 'lucide-react'

type WorkspaceHeaderProps = {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

function WorkspaceHeader({
  title = 'Product Engineering',
  subtitle = 'Manage your team members and workspace preferences.',
  actionLabel = 'Create Workspace',
  onAction,
}: WorkspaceHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </button>
    </section>
  )
}

export default WorkspaceHeader
