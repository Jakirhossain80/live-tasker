type LoadingStateProps = {
  title?: string
  message?: string
  rows?: number
  className?: string
}

function LoadingState({
  title = 'Loading',
  message = 'Fetching the latest workspace data.',
  rows = 3,
  className = '',
}: LoadingStateProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>

          <div className="mt-5 space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-5/12 animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoadingState
