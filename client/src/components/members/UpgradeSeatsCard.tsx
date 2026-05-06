import { ArrowRight, Crown } from 'lucide-react'

function UpgradeSeatsCard() {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-indigo-100 ring-1 ring-white/10">
          <Crown className="h-3.5 w-3.5" />
          Upgrade
        </span>

        <h3 className="mt-5 text-lg font-bold">Need more seats?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Our Pro plan includes unlimited members and advanced permissions.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-indigo-50"
        >
          View Plans
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

export default UpgradeSeatsCard
