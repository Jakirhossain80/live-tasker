import type { ReactNode } from 'react'

type StatsCardProps = {
  title: string
  value: string
  badge: string
  icon: ReactNode
  accentClassName: string
  badgeClassName: string
}

function StatsCard({ title, value, badge, icon, accentClassName, badgeClassName }: StatsCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${accentClassName}`}>
          {icon}
        </div>
      </div>
      <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassName}`}>
        {badge}
      </span>
    </article>
  )
}

export default StatsCard
