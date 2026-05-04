import { Filter, Plus } from 'lucide-react'

const members = [
  { name: 'Sarah Chen', initials: 'SC', className: 'bg-indigo-600' },
  { name: 'Alex Rivera', initials: 'AR', className: 'bg-emerald-600' },
  { name: 'Mina Lee', initials: 'ML', className: 'bg-rose-600' },
]

function KanbanHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Kanban Board</h1>

        <div className="flex -space-x-2">
          {members.map((member) => (
            <div
              key={member.name}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-sm ${member.className}`}
              title={member.name}
            >
              {member.initials}
            </div>
          ))}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600 shadow-sm"
            title="3 more members"
          >
            +3
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Column
        </button>
      </div>
    </section>
  )
}

export default KanbanHeader
