function AccountStatusCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Account Status</h3>

      <div className="mt-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
        <span className="text-sm font-semibold text-slate-950">Plan details are not connected yet</span>
      </div>

      <div className="mt-5">
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: '40%' }} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Demo usage only. Storage data is not connected yet.</p>
      </div>
    </section>
  )
}

export default AccountStatusCard
