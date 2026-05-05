import { BadgePlus, CalendarDays, CheckCircle, MoveDown, Plus, UserPlus } from 'lucide-react'
import ActivityStats from '../../components/activity/ActivityStats'
import ActivityTimeline from '../../components/activity/ActivityTimeline'
import type { TimelineGroup } from '../../components/activity/ActivityTimeline'
import type { TimelineItem } from '../../components/activity/ActivityTimelineItem'

const todayItems: TimelineItem[] = [
  {
    id: 1,
    title: 'Marcus Thorne created Task: Q4 Revenue Forecast',
    description: 'Initial draft for the executive board review. Needs input from Sales and Marketing by EOD Friday.',
    actor: 'Marcus Thorne',
    time: '10:45 AM',
    project: 'Task: Q4 Revenue Forecast',
    status: 'Created',
    icon: BadgePlus,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    hoverBorderClassName: 'hover:border-indigo-300',
  },
  {
    id: 2,
    title: 'Elena Rodriguez moved Task: Mobile UI Kit',
    description: 'Task status changed as design production started for the mobile component set.',
    actor: 'Elena Rodriguez',
    time: '09:12 AM',
    project: 'Task: Mobile UI Kit',
    status: 'Moved',
    icon: MoveDown,
    iconClassName: 'bg-amber-50 text-amber-600',
    hoverBorderClassName: 'hover:border-amber-300',
    transition: {
      from: 'Backlog',
      to: 'In Progress',
    },
  },
  {
    id: 3,
    title: 'David Chen assigned Task: API Integration',
    description: 'Ownership was assigned for the next integration milestone.',
    actor: 'David Chen',
    time: '08:30 AM',
    project: 'Task: API Integration',
    status: 'Assigned',
    icon: UserPlus,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    hoverBorderClassName: 'hover:border-emerald-300',
    assignee: 'Sarah Jenkins',
  },
]

const yesterdayItems: TimelineItem[] = [
  {
    id: 4,
    title: 'System Automations marked as done Task: Weekly Security Audit',
    description: 'All 14 checkpoints passed successfully.',
    actor: 'System Automations',
    time: '05:00 PM',
    project: 'Task: Weekly Security Audit',
    status: 'Completed',
    icon: CheckCircle,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    hoverBorderClassName: 'hover:border-indigo-300',
    isDetailItalic: true,
  },
]

const timelineGroups: TimelineGroup[] = [
  {
    date: 'Today, Oct 24',
    items: todayItems,
  },
  {
    date: 'Yesterday, Oct 23',
    items: yesterdayItems,
  },
]

function Activity() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Activity Timeline</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Real-time update stream for all workspace movements and task transitions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <CalendarDays className="h-4 w-4" />
            Today
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </section>

      <ActivityStats />

      <section>
        <ActivityTimeline groups={timelineGroups} />
      </section>
    </div>
  )
}

export default Activity
