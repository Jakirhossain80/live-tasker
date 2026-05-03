import { CalendarDays, CheckCircle2, ClipboardList, Clock3, Palette, Plus, Rocket, Terminal } from 'lucide-react'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import StatsCard from '../../components/dashboard/StatsCard'
import TaskCard from '../../components/dashboard/TaskCard'
import UpgradeCard from '../../components/dashboard/UpgradeCard'

const stats = [
  {
    title: 'Total Tasks',
    value: '128',
    badge: '+12%',
    icon: <ClipboardList className="h-6 w-6 text-indigo-600" />,
    accentClassName: 'bg-indigo-50',
    badgeClassName: 'bg-indigo-50 text-indigo-700',
  },
  {
    title: 'Completed',
    value: '84',
    badge: '+4%',
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
    accentClassName: 'bg-emerald-50',
    badgeClassName: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'In Progress',
    value: '32',
    badge: 'Stable',
    icon: <Clock3 className="h-6 w-6 text-amber-600" />,
    accentClassName: 'bg-amber-50',
    badgeClassName: 'bg-amber-50 text-amber-700',
  },
]

const tasks = [
  {
    title: 'Q4 Product Roadmap Presentation',
    description: 'Prepare final deck for stakeholder review meeting next Monday.',
    label: 'Product',
    due: 'Due Oct 24',
    comments: '12 comments',
    icon: <Rocket className="h-5 w-5 text-indigo-600" />,
    iconClassName: 'bg-indigo-50',
  },
  {
    title: 'API Integration: Stripe Connect',
    description: 'Implement secure payout logic for vendor marketplace dashboard.',
    label: 'Engineering',
    due: 'Due Tomorrow',
    icon: <Terminal className="h-5 w-5 text-emerald-600" />,
    iconClassName: 'bg-emerald-50',
  },
  {
    title: 'Brand Identity Refresh: Phase 1',
    description: 'Initial logo exploration and color palette variations for marketing.',
    label: 'Design',
    due: 'Overdue',
    icon: <Palette className="h-5 w-5 text-rose-600" />,
    iconClassName: 'bg-rose-50',
  },
]

const activities = [
  {
    id: 1,
    user: 'Alex Chen',
    action: 'completed Mobile Navbar UI',
    time: '2 minutes ago',
  },
  {
    id: 2,
    user: 'Maria Lopez',
    action: 'commented on Q4 Strategy',
    time: '15 minutes ago',
    quote: "Looks great, but let's double check the budget allocation for marketing.",
  },
  {
    id: 3,
    user: 'System',
    action: 'automatically archived 14 old tasks',
    time: '1 hour ago',
  },
]

function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Welcome back, Sarah</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm text-slate-500">You have 4 tasks to complete today.</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <CalendarDays className="h-4 w-4" />
          This Week
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            badge={stat.badge}
            icon={stat.icon}
            accentClassName={stat.accentClassName}
            badgeClassName={stat.badgeClassName}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent Tasks</h2>
            </div>
            <button
              type="button"
              className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"
            >
              View All
            </button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.title}
                title={task.title}
                description={task.description}
                label={task.label}
                due={task.due}
                comments={task.comments}
                icon={task.icon}
                iconClassName={task.iconClassName}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ActivityFeed activities={activities} />
          <UpgradeCard />
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl"
        aria-label="Create new task"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}

export default DashboardHome
