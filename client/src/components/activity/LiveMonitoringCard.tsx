const avatars = ['SM', 'AC', 'MP', 'JL']

function LiveMonitoringCard() {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Live Monitoring</p>
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-950">Team Velocity High</p>
        </div>

        <div className="flex -space-x-2">
          {avatars.map((avatar) => (
            <div
              key={avatar}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-50 text-xs font-bold text-indigo-700 shadow-sm"
            >
              {avatar}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default LiveMonitoringCard
