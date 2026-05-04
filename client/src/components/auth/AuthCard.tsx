import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur sm:p-8">
      <div className="mb-6 sm:mb-7">
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  )
}

export default AuthCard
