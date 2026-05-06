import type { LucideIcon } from 'lucide-react'

export type MemberStatCardProps = {
  label: string
  value: string
  helper?: string
  helperClassName?: string
  icon?: LucideIcon
  iconClassName?: string
  showPulse?: boolean
  variant?: 'default' | 'primary'
}

function MemberStatCard({
  label,
  value,
  helper,
  helperClassName = 'text-slate-500',
  icon: Icon,
  iconClassName = 'bg-indigo-50 text-indigo-600',
  showPulse = false,
  variant = 'default',
}: MemberStatCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        isPrimary ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${isPrimary ? 'text-indigo-100' : 'text-slate-500'}`}>
            {label}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <p className={`text-3xl font-bold ${isPrimary ? 'text-white' : 'text-slate-950'}`}>{value}</p>
            {showPulse ? (
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            ) : null}
          </div>
        </div>
        {Icon ? (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
              isPrimary ? 'bg-white/15 text-white' : iconClassName
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {helper ? <p className={`mt-4 text-sm font-semibold ${isPrimary ? 'text-indigo-100' : helperClassName}`}>{helper}</p> : null}
    </article>
  )
}

export default MemberStatCard
