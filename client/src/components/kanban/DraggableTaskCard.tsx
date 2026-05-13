import type { CSSProperties } from 'react'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import KanbanTaskCard, { type KanbanTaskCardProps } from './KanbanTaskCard'

type DraggableTaskCardProps = KanbanTaskCardProps & {
  taskId: UniqueIdentifier
  isDragEnabled?: boolean
}

function DraggableTaskCard({ taskId, isDragEnabled = false, ...taskCardProps }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: taskId,
    disabled: !isDragEnabled,
  })

  const style: CSSProperties = {
    transform: `${CSS.Transform.toString(transform) ?? ''}${isDragging ? ' scale(1.02)' : ''}`,
    transition,
    zIndex: isDragging ? 20 : undefined,
  }
  const dragClassName = isDragEnabled
    ? `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 ${
        isDragging
          ? 'cursor-grabbing border-indigo-300 shadow-xl shadow-slate-900/10 ring-2 ring-indigo-200'
          : 'cursor-grab active:cursor-grabbing'
      }`
    : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl outline-none transition-[opacity,transform] duration-150 ${isDragging ? 'opacity-80' : ''}`}
      {...(isDragEnabled ? attributes : undefined)}
      {...(isDragEnabled ? listeners : undefined)}
    >
      <KanbanTaskCard {...taskCardProps} className={`${taskCardProps.className ?? ''} ${dragClassName}`} />
    </div>
  )
}

export default DraggableTaskCard
