import { Plus } from 'lucide-react'

type KanbanAddTaskButtonProps = {
  label?: string
}

function KanbanAddTaskButton({ label = 'Add Task' }: KanbanAddTaskButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  )
}

export default KanbanAddTaskButton
