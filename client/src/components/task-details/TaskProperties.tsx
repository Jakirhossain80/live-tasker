import { ChevronDown, Plus } from 'lucide-react'

function TaskProperties() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Properties</h3>

      <div className="mt-5 space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-slate-950">Assigned To</h4>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              SC
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">Sarah Chen</p>
              <p className="text-xs text-slate-500">Documentation Lead</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-950">Due Date</h4>
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-rose-950">Oct 24, 2023</span>
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">Overdue</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-950">Priority</h4>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            High Priority
            <ChevronDown className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default TaskProperties
