import { BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export type ProfileStat = {
  label: string
  value: string
  icon: LucideIcon
  iconClassName: string
  hoverBorderClassName: string
}

type ProfileStatsProps = {
  stats: ProfileStat[]
}

function ProfileStats({ stats }: ProfileStatsProps) {
  if (stats.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No profile stats yet"
        message="Task and workspace stats will appear here when they are available."
      />
    )
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            key={stat.label}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors ${stat.hoverBorderClassName}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{stat.value}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconClassName}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default ProfileStats
