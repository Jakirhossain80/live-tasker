export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'High Priority' | 'Recurring'

type TaskStatusBadgeProps = {
  status: TaskStatus
}

const statusClassNames: Record<TaskStatus, string> = {
  'To Do': 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-indigo-50 text-indigo-700',
  Done: 'bg-emerald-50 text-emerald-700',
  'High Priority': 'bg-rose-50 text-rose-700',
  Recurring: 'bg-blue-50 text-blue-700',
}

function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassNames[status]}`}>
      {status}
    </span>
  )
}

export default TaskStatusBadge
