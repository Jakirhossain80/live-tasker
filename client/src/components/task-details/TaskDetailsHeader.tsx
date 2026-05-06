import { Clock3, LockKeyhole } from 'lucide-react'

function TaskDetailsHeader() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase text-indigo-700">
          Documentation
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <LockKeyhole className="h-4 w-4" />
          Private
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">Update API Documentation</h2>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-400" />
          Created 2 days ago
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Live now
        </span>
      </div>
    </section>
  )
}

export default TaskDetailsHeader
