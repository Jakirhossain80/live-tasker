import { CalendarDays, MoreVertical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TaskPriorityBadge, { type TaskPriority } from './TaskPriorityBadge'
import TaskStatusBadge, { type TaskStatus } from './TaskStatusBadge'

export type MyTask = {
  id: string
  title: string
  project: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
  icon: LucideIcon
  iconClassName: string
}

type MyTasksTableRowProps = {
  task: MyTask
}

function MyTasksTableRow({ task }: MyTasksTableRowProps) {
  const Icon = task.icon
  const navigate = useNavigate()
  const taskDetailsPath = `/dashboard/tasks/${task.id}`

  return (
    <tr
      className="cursor-pointer border-t border-slate-100 bg-white transition hover:bg-indigo-50/50"
      role="link"
      tabIndex={0}
      onClick={() => navigate(taskDetailsPath)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate(taskDetailsPath)
        }
      }}
    >
      <td className="min-w-[320px] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${task.iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{task.title}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{task.project}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="px-5 py-4">
        <TaskPriorityBadge priority={task.priority} />
      </td>
      <td className="min-w-[150px] px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {task.dueDate}
        </div>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label={`More options for ${task.title}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

export default MyTasksTableRow
