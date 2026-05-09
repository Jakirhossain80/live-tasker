import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../../store/auth.store'

type RouteGuardProps = {
  children?: ReactNode
}

function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 text-slate-950">
      <p className="text-sm font-semibold text-slate-500">Loading LiveTasker...</p>
    </main>
  )
}

export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped)

  if (!isBootstrapped) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children ?? <Outlet />
}

function ProtectedRoute({ children }: RouteGuardProps) {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped)

  if (!isBootstrapped) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
