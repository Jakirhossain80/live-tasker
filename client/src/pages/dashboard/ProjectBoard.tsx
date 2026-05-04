import { Plus } from 'lucide-react'
import KanbanColumn, { type KanbanTask } from '../../components/kanban/KanbanColumn'
import KanbanHeader from '../../components/kanban/KanbanHeader'

type KanbanColumnData = {
  id: string
  title: string
  count: number
  accentClassName: string
  tasks: KanbanTask[]
}

const columns: KanbanColumnData[] = [
  {
    id: 'todo',
    title: 'Todo',
    count: 3,
    accentClassName: 'bg-slate-400',
    tasks: [
      {
        id: 1,
        title: 'Refactor API middleware for real-time updates',
        description:
          'Integrate WebSocket listeners with the current task management logic to allow instant syncing.',
        priority: 'High',
        dueDate: 'Oct 24',
        priorityClassName: 'bg-rose-50 text-rose-700',
      },
      {
        id: 2,
        title: 'Define dark mode color palette',
        description: 'Ensure all accessibility ratios are met for the new slate-900 series backgrounds.',
        priority: 'Medium',
        dueDate: 'Oct 26',
        priorityClassName: 'bg-amber-50 text-amber-700',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    count: 1,
    accentClassName: 'bg-indigo-500',
    tasks: [
      {
        id: 3,
        title: 'Onboarding flow illustrations',
        priority: 'Low',
        comments: 4,
        live: true,
        hasImage: true,
        priorityClassName: 'bg-emerald-50 text-emerald-700',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    count: 2,
    accentClassName: 'bg-violet-500',
    tasks: [
      {
        id: 4,
        title: 'Security audit for auth endpoints',
        description: 'Complete PEN test on /login and /signup routes before the production push.',
        priority: 'High',
        dueDate: 'Oct 22',
        priorityClassName: 'bg-rose-50 text-rose-700',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    count: 12,
    accentClassName: 'bg-emerald-500',
    tasks: [
      {
        id: 5,
        title: 'Update landing page copy',
        priority: 'Low',
        dueDate: 'Oct 18',
        completed: true,
        priorityClassName: 'bg-emerald-50 text-emerald-700',
      },
    ],
  },
]

function ProjectBoard() {
  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <KanbanHeader />

      <div className="kanban-board-scroll min-h-[calc(100vh-196px)] overflow-x-auto pb-3 sm:min-h-[calc(100vh-172px)]">
        <div className="flex h-full gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              count={column.count}
              accentClassName={column.accentClassName}
              tasks={column.tasks}
              showAddTaskButton={column.id === 'todo'}
            />
          ))}
          <button
            type="button"
            className="flex min-h-[calc(100vh-196px)] min-w-[320px] max-w-[320px] shrink-0 items-start justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:min-h-[calc(100vh-172px)]"
          >
            <Plus className="mt-0.5 h-4 w-4" />
            New Column
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectBoard
