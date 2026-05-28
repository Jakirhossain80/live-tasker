type SkeletonProps = {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const roundedClassNames: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

function Skeleton({ className = '', rounded = 'lg' }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse bg-slate-200 ${roundedClassNames[rounded]} ${className}`}
    />
  )
}

type SkeletonTextProps = {
  lines?: number
  className?: string
  widths?: string[]
}

export function SkeletonText({ lines = 3, className = '', widths = ['w-full', 'w-11/12', 'w-8/12'] }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-3 ${widths[index % widths.length]}`}
          rounded="full"
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ className = '' }: Pick<SkeletonProps, 'className'>) {
  return <Skeleton className={`h-10 w-10 shrink-0 ${className}`} rounded="full" />
}

export default Skeleton
