import { Activity, Check, Home, MoreHorizontal, Plus, Settings, SquareCheckBig } from 'lucide-react'

function TaskActionButtons() {
  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <Check className="h-4 w-4" />
            Complete Task
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-center gap-2">
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-xs font-medium text-slate-500">
            <Home className="h-5 w-5" />
            Home
          </button>
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-xs font-semibold text-indigo-700">
            <SquareCheckBig className="h-5 w-5" />
            Tasks
          </button>
          <button
            type="button"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
            aria-label="Add task"
          >
            <Plus className="h-6 w-6" />
          </button>
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-xs font-medium text-slate-500">
            <Activity className="h-5 w-5" />
            Activity
          </button>
          <button type="button" className="flex flex-col items-center gap-1 py-1 text-xs font-medium text-slate-500">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </nav>
    </>
  )
}

export default TaskActionButtons
