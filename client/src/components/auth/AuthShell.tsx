import type { ReactNode } from 'react'
import AuthBrand from './AuthBrand'

type AuthShellProps = {
  children: ReactNode
}

function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#faf8ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,rgba(168,85,247,0.12)_42%,transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.18)_0%,rgba(99,102,241,0.1)_44%,transparent_72%)] blur-2xl sm:h-96 sm:w-96" />
      </div>

      <section className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8 sm:py-10">
        <div className="w-full max-w-[448px]">
          <AuthBrand />

          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthShell
