import { ArrowUpDown, Bug, Code, FileText, ListFilter, Palette, Users } from 'lucide-react'
import MyTasksStats from '../../components/tasks/MyTasksStats'
import MyTasksTable from '../../components/tasks/MyTasksTable'
import type { MyTask } from '../../components/tasks/MyTasksTableRow'

const tasks: MyTask[] = [
  {
    id: 1,
    title: 'Update Design System documentation',
    project: 'Internal Design Project',
    dueDate: 'Oct 24, 2023',
    status: 'In Progress',
    priority: 'High',
    icon: FileText,
    iconClassName: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 2,
    title: 'Refactor Auth Middleware',
    project: 'Core Engine',
    dueDate: 'Oct 22, 2023',
    status: 'Done',
    priority: 'Low',
    icon: Code,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 3,
    title: 'Finalize Color Palette V2',
    project: 'Visual Identity',
    dueDate: 'Oct 28, 2023',
    status: 'To Do',
    priority: 'Medium',
    icon: Palette,
    iconClassName: 'bg-amber-50 text-amber-600',
  },
  {
    id: 4,
    title: 'Critical: Payment Gateway Timeout',
    project: 'Platform Stability',
    dueDate: 'ASAP',
    status: 'High Priority',
    priority: 'Urgent',
    icon: Bug,
    iconClassName: 'bg-rose-50 text-rose-600',
  },
  {
    id: 5,
    title: 'Weekly Team Sync',
    project: 'General',
    dueDate: 'Oct 26, 2023',
    status: 'Recurring',
    priority: 'Medium',
    icon: Users,
    iconClassName: 'bg-blue-50 text-blue-600',
  },
]

const tabs = ['All Tasks', 'Today', 'Upcoming', 'Completed']

function MyTasks() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">My Tasks</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage and track your active task items in real-time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ListFilter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
        </div>
      </section>

      <MyTasksStats />

      <section className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition ${
              index === 0 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      <MyTasksTable tasks={tasks} />
    </div>
  )
}

export default MyTasks
