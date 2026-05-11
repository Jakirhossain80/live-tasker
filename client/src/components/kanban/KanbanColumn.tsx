import KanbanAddTaskButton from './KanbanAddTaskButton'
import KanbanTaskCard from './KanbanTaskCard'

export type KanbanTask = {
  id: string
  status: string
  order: number
  title: string
  description?: string
  priority: string
  dueDate?: string
  comments?: number
  live?: boolean
  hasImage?: boolean
  completed?: boolean
  priorityClassName: string
}

type KanbanColumnProps = {
  columnId: string
  title: string
  count: number
  accentClassName: string
  tasks: KanbanTask[]
  columnOptions?: { id: string; title: string }[]
  showAddTaskButton?: boolean
  onAddTask?: (columnId: string) => void
  onTaskClick?: (taskId: string) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onMoveTask?: (taskId: string, status: string) => void
}

function KanbanColumn({
  columnId,
  title,
  count,
  accentClassName,
  tasks,
  columnOptions,
  showAddTaskButton = false,
  onAddTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: KanbanColumnProps) {
  return (
    <section className="flex min-h-[calc(100vh-196px)] min-w-[320px] max-w-[320px] shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:min-h-[calc(100vh-172px)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${accentClassName}`} />
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {count}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              status={task.status}
              title={task.title}
              description={task.description}
              priority={task.priority}
              dueDate={task.dueDate}
              comments={task.comments}
              live={task.live}
              hasImage={task.hasImage}
              completed={task.completed}
              priorityClassName={task.priorityClassName}
              columnOptions={columnOptions}
              onClick={() => onTaskClick?.(task.id)}
              onEdit={() => onEditTask?.(task.id)}
              onDelete={() => onDeleteTask?.(task.id)}
              onMove={(status) => onMoveTask?.(task.id, status)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-center text-sm font-medium leading-6 text-slate-400">
            No tasks in this column yet.
          </div>
        )}
      </div>

      {showAddTaskButton ? (
        <div className="mt-4">
          <KanbanAddTaskButton onClick={() => onAddTask?.(columnId)} />
        </div>
      ) : null}
    </section>
  )
}

export default KanbanColumn
