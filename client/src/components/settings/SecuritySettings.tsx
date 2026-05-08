function SecuritySettings() {
  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Security</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Current Password</span>
          <input type="password" placeholder="••••••••" className={inputClassName} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">New Password</span>
          <input type="password" placeholder="Min 12 characters" className={inputClassName} />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
        >
          Update Password
        </button>
      </div>
    </section>
  )
}

export default SecuritySettings
