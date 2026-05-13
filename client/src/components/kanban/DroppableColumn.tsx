import type { ReactNode } from 'react'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'

type DroppableColumnProps = {
  columnId: UniqueIdentifier
  title: string
  count: number
  accentClassName: string
  children: ReactNode
  footer?: ReactNode
  isDropEnabled?: boolean
}

function DroppableColumn({
  columnId,
  title,
  count,
  accentClassName,
  children,
  footer,
  isDropEnabled = false,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    disabled: !isDropEnabled,
  })

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[calc(100vh-196px)] min-w-[320px] max-w-[320px] shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-[background-color,border-color,box-shadow] duration-150 sm:min-h-[calc(100vh-172px)] ${
        isOver ? 'border-indigo-300 bg-indigo-50/50 shadow-md ring-2 ring-indigo-100' : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${accentClassName}`} />
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
          {count}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">{children}</div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  )
}

export default DroppableColumn
