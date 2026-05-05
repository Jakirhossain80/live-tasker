import { ClipboardPlus, ListChecks } from 'lucide-react'
import ActivityStatCard from './ActivityStatCard'
import LiveMonitoringCard from './LiveMonitoringCard'

const stats = [
  {
    label: 'Tasks Created',
    value: '142',
    badge: '+12%',
    icon: ClipboardPlus,
    iconClassName: 'bg-indigo-50 text-indigo-600',
    badgeClassName: 'bg-indigo-50 text-indigo-700',
  },
  {
    label: 'Completed This Week',
    value: '89',
    badge: '+5%',
    icon: ListChecks,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    badgeClassName: 'bg-emerald-50 text-emerald-700',
  },
]

function ActivityStats() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <ActivityStatCard key={stat.label} {...stat} />
      ))}
      <LiveMonitoringCard />
    </section>
  )
}

export default ActivityStats
