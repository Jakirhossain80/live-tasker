import { AlertTriangle, LayoutDashboard, RotateCcw } from 'lucide-react'

type ErrorFallbackProps = {
  onRetry?: () => void
  dashboardHref?: string
  className?: string
}

function ErrorFallback({ onRetry, dashboardHref = '/dashboard', className = '' }: ErrorFallbackProps) {
  function handleRetry() {
    if (onRetry) {
      onRetry()
      return
    }

    window.location.reload()
  }

  return (
    <section className={`rounded-xl border border-rose-100 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950">Something went wrong.</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Please try again or return to your dashboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>

          <a
            href={dashboardHref}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </a>
        </div>
      </div>
    </section>
  )
}

export default ErrorFallback
