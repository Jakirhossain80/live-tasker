import type { LucideIcon } from 'lucide-react'

type ActivityStatCardProps = {
  label: string
  value: string
  icon: LucideIcon
  iconClassName: string
  badge: string
  badgeClassName: string
}

function ActivityStatCard({ label, value, icon: Icon, iconClassName, badge, badgeClassName }: ActivityStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <span className={`mt-5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassName}`}>{badge}</span>
    </article>
  )
}

export default ActivityStatCard
