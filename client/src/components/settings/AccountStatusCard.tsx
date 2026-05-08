function AccountStatusCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Account Status</h3>

      <div className="mt-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold text-slate-950">LiveSync Active</span>
      </div>

      <div className="mt-5">
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: '75%' }} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Storage: 7.5GB of 10GB used</p>
      </div>
    </section>
  )
}

export default AccountStatusCard
