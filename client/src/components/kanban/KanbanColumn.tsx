import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanAddTaskButton from './KanbanAddTaskButton'
import DraggableTaskCard from './DraggableTaskCard'
import DroppableColumn from './DroppableColumn'

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
  isDragEnabled?: boolean
  isDropEnabled?: boolean
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
  isDragEnabled = false,
  isDropEnabled = false,
  onAddTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: KanbanColumnProps) {
  const taskIds = tasks.map((task) => task.id)

  return (
    <DroppableColumn
      columnId={columnId}
      title={title}
      count={count}
      accentClassName={accentClassName}
      isDropEnabled={isDropEnabled}
      footer={showAddTaskButton ? <KanbanAddTaskButton onClick={() => onAddTask?.(columnId)} /> : undefined}
    >
      {tasks.length > 0 ? (
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              taskId={task.id}
              isDragEnabled={isDragEnabled}
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
          ))}
        </SortableContext>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-center text-sm font-medium leading-6 text-slate-400">
          No tasks in this column yet.
        </div>
      )}
    </DroppableColumn>
  )
}

export default KanbanColumn
