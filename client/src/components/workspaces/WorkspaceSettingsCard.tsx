function WorkspaceSettingsCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-slate-950">Workspace Settings</h3>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            type="text"
            defaultValue="Product Engineering"
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea
            defaultValue="Core development and engineering hub for the main platform roadmap."
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <div>
            <p className="text-sm font-bold text-slate-950">Privacy Mode</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">Only invited members can join</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked="true"
            aria-label="Privacy Mode"
            className="flex h-7 w-12 shrink-0 items-center rounded-full bg-indigo-600 p-1 shadow-inner transition"
          >
            <span className="h-5 w-5 translate-x-5 rounded-full bg-white shadow-sm transition" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
      >
        Save Changes
      </button>
    </section>
  )
}

export default WorkspaceSettingsCard
