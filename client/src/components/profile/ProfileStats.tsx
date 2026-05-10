import { Boxes, CheckCircle2, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  const fallbackStats =
    stats.length > 0
      ? stats
      : [
          {
            label: 'Assigned Tasks',
            value: '42',
            icon: ClipboardList,
            iconClassName: 'bg-indigo-50 text-indigo-600',
            hoverBorderClassName: 'hover:border-indigo-300',
          },
          {
            label: 'Completed Tasks',
            value: '128',
            icon: CheckCircle2,
            iconClassName: 'bg-emerald-50 text-emerald-600',
            hoverBorderClassName: 'hover:border-emerald-300',
          },
          {
            label: 'Workspaces',
            value: '4',
            icon: Boxes,
            iconClassName: 'bg-amber-50 text-amber-600',
            hoverBorderClassName: 'hover:border-amber-300',
          },
        ]

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {fallbackStats.map((stat) => {
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
