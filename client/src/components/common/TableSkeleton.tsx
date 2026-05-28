import Skeleton from './Skeleton'

type TableSkeletonProps = {
  className?: string
  columns?: number
  rows?: number
  showHeader?: boolean
}

function TableSkeleton({ className = '', columns = 5, rows = 5, showHeader = true }: TableSkeletonProps) {
  return (
    <section className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {showHeader ? (
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-7/12" rounded="full" />
          ))}
        </div>
      ) : null}

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid items-center gap-4 px-5 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div key={columnIndex} className="min-w-0">
                {columnIndex === 0 ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3 w-9/12" rounded="full" />
                      <Skeleton className="h-3 w-6/12 bg-slate-100" rounded="full" />
                    </div>
                  </div>
                ) : (
                  <Skeleton
                    className={`${columnIndex % 2 === 0 ? 'w-8/12' : 'w-10/12'} h-3`}
                    rounded="full"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default TableSkeleton
