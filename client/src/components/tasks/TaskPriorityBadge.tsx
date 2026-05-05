export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

type TaskPriorityBadgeProps = {
  priority: TaskPriority
}

const priorityClassNames: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-indigo-50 text-indigo-700',
  High: 'bg-red-50 text-red-700',
  Urgent: 'bg-red-100 text-red-700',
}

function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassNames[priority]}`}>
      {priority}
    </span>
  )
}

export default TaskPriorityBadge
