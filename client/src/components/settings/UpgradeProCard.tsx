function UpgradeProCard() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-indigo-600 p-5 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-indigo-300/30 blur-2xl" />

      <div className="relative">
        <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
        <p className="mt-2 text-sm leading-6 text-indigo-100">
          Unlock team analytics, priority support, and unlimited workspaces.
        </p>

        <button
          type="button"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-indigo-600"
        >
          View Pricing
        </button>
      </div>
    </section>
  )
}

export default UpgradeProCard
