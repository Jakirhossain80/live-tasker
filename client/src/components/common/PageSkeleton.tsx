import CardSkeleton from './CardSkeleton'
import Skeleton from './Skeleton'
import TableSkeleton from './TableSkeleton'

type PageSkeletonProps = {
  className?: string
  showStats?: boolean
  showTable?: boolean
  titleWidthClassName?: string
}

function PageSkeleton({
  className = '',
  showStats = true,
  showTable = false,
  titleWidthClassName = 'w-64',
}: PageSkeletonProps) {
  return (
    <div className={`mx-auto max-w-7xl space-y-6 ${className}`} aria-label="Loading content" role="status">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <Skeleton className={`h-8 max-w-full ${titleWidthClassName}`} rounded="full" />
          <Skeleton className="mt-3 h-3 w-full max-w-xl" rounded="full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </section>

      {showStats ? (
        <section className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} rows={1} showAvatar={false} />
          ))}
        </section>
      ) : null}

      {showTable ? (
        <TableSkeleton />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4">
            <CardSkeleton rows={2} />
            <CardSkeleton rows={2} />
          </div>
          <aside className="space-y-6">
            <CardSkeleton rows={3} />
            <CardSkeleton rows={2} showFooter />
          </aside>
        </section>
      )}
    </div>
  )
}

export default PageSkeleton
