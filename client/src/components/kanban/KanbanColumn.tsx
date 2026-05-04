import KanbanAddTaskButton from './KanbanAddTaskButton'
import KanbanTaskCard from './KanbanTaskCard'

export type KanbanTask = {
  id: number
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
  title: string
  count: number
  accentClassName: string
  tasks: KanbanTask[]
  showAddTaskButton?: boolean
}

function KanbanColumn({ title, count, accentClassName, tasks, showAddTaskButton = false }: KanbanColumnProps) {
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
        {tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            dueDate={task.dueDate}
            comments={task.comments}
            live={task.live}
            hasImage={task.hasImage}
            completed={task.completed}
            priorityClassName={task.priorityClassName}
          />
        ))}
      </div>

      {showAddTaskButton ? (
        <div className="mt-4">
          <KanbanAddTaskButton />
        </div>
      ) : null}
    </section>
  )
}

export default KanbanColumn
