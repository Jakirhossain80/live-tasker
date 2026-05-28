import Skeleton, { SkeletonText } from './Skeleton'

type CardSkeletonProps = {
  className?: string
  rows?: number
  showAvatar?: boolean
  showFooter?: boolean
}

function CardSkeleton({ className = '', rows = 3, showAvatar = true, showFooter = false }: CardSkeletonProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        {showAvatar ? <Skeleton className="h-10 w-10 shrink-0" /> : null}

        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-5/12" rounded="full" />
          <SkeletonText lines={rows} className="mt-4" />
        </div>
      </div>

      {showFooter ? (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      ) : null}
    </section>
  )
}

export default CardSkeleton
