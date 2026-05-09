import { ChevronRight, Download, Shield } from 'lucide-react'

function DataAccessCard() {
  return (
    <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-950">Data Access</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Manage workspace permissions and export your team's historical performance data.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <span>Audit Logs</span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <span>Export Data (.csv)</span>
          <Download className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}

export default DataAccessCard
