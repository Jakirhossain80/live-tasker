import { FileText } from 'lucide-react'

type TaskDescriptionProps = {
  description?: string
  labels: string[]
}

function TaskDescription({ description, labels }: TaskDescriptionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-slate-950">Description</h3>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">{description || 'No description provided.'}</p>

      {labels.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
          {labels.map((label) => (
            <li key={label} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default TaskDescription
