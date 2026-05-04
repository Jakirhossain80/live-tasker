import { Rocket } from 'lucide-react'
import type { ReactNode } from 'react'

type AuthShellProps = {
  children: ReactNode
}

function ActivitySkeletonRow({ avatarClassName }: { avatarClassName: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-9 w-9 rounded-full ${avatarClassName}`} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-2.5 w-28 rounded-full bg-slate-300/70" />
        <div className="h-2 w-20 rounded-full bg-slate-200/80" />
      </div>
    </div>
  )
}

function SideActivityCard() {
  return (
    <aside className="fixed bottom-8 right-8 z-20 hidden w-72 rounded-xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-950">Real-time Activity</h2>
        <span className="relative flex h-3 w-3" aria-label="Live activity">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
      </div>

      <div className="space-y-4">
        <ActivitySkeletonRow avatarClassName="bg-indigo-100" />
        <ActivitySkeletonRow avatarClassName="bg-emerald-100" />
      </div>
    </aside>
  )
}

function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#faf8ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.14)_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute right-[-160px] top-[18%] h-80 w-80 rounded-full bg-fuchsia-200/45 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-180px] left-[20%] h-80 w-80 rounded-full bg-sky-200/45 blur-3xl sm:left-[32%] sm:h-96 sm:w-96" />
      </div>

      <section className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8 sm:py-10">
        <div className="w-full max-w-[448px]">
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 sm:h-14 sm:w-14">
              <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-950 sm:text-3xl">LiveTasker</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Real-time productivity for fast teams.</p>
          </div>

          {children}
        </div>
      </section>

      <SideActivityCard />
    </main>
  )
}

export default AuthShell
