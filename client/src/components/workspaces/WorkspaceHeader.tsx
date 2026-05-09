import { UserPlus } from 'lucide-react'

type WorkspaceHeaderProps = {
  title?: string
  subtitle?: string
}

function WorkspaceHeader({
  title = 'Product Engineering',
  subtitle = 'Manage your team members and workspace preferences.',
}: WorkspaceHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <UserPlus className="h-4 w-4" />
        Invite Member
      </button>
    </section>
  )
}

export default WorkspaceHeader
