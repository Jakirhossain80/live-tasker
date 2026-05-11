import { AlertTriangle, RotateCcw } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  message: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

function ErrorState({
  title = 'Something went wrong',
  message,
  retryLabel = 'Try again',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <section className={`rounded-xl border border-rose-100 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>
          </div>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
          >
            <RotateCcw className="h-4 w-4" />
            {retryLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default ErrorState
