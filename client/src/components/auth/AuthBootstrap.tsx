import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { getCurrentUser, refreshAccessToken } from '../../api/auth'
import { useAuthStore } from '../../store/auth.store'

type AuthBootstrapProps = {
  children: ReactNode
}

type RestoredSession = {
  accessToken: string
  user: Awaited<ReturnType<typeof getCurrentUser>>['user']
}

let bootstrapSessionRequest: Promise<RestoredSession> | null = null

async function restoreSession() {
  bootstrapSessionRequest ??= (async () => {
    const { accessToken } = await refreshAccessToken()
    const { user } = await getCurrentUser()

    return { accessToken, user }
  })()

  return bootstrapSessionRequest
}

function AuthBootstrap({ children }: AuthBootstrapProps) {
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped)

  useEffect(() => {
    let isMounted = true

    async function bootstrapAuth() {
      try {
        const { accessToken, user } = await restoreSession()

        if (isMounted) {
          setAuth(user, accessToken)
        }
      } catch {
        if (isMounted) {
          clearAuth()
        }
      } finally {
        if (isMounted) {
          setBootstrapped(true)
        }
      }
    }

    bootstrapAuth()

    return () => {
      isMounted = false
    }
  }, [clearAuth, setAuth, setBootstrapped])

  if (!isBootstrapped) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 text-slate-950">
        <p className="text-sm font-semibold text-slate-500">Loading LiveTasker...</p>
      </main>
    )
  }

  return children
}

export default AuthBootstrap
