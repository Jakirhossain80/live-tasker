const stats = [
  {
    label: 'TOTAL TASKS',
    value: '124',
    valueClassName: 'text-slate-950',
  },
  {
    label: 'IN PROGRESS',
    value: '32',
    valueClassName: 'text-slate-950',
    showPulse: true,
  },
  {
    label: 'COMPLETED TODAY',
    value: '12',
    valueClassName: 'text-emerald-600',
  },
]

function MyTasksStats() {
  return (
    <section className="flex gap-4 overflow-x-auto pb-1 lg:overflow-visible">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{stat.label}</p>
            {stat.showPulse ? (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            ) : null}
          </div>
          <p className={`mt-3 text-3xl font-bold ${stat.valueClassName}`}>{stat.value}</p>
        </article>
      ))}
    </section>
  )
}

export default MyTasksStats
