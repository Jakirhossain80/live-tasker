import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { acceptInvite } from '../api/invites'
import CardSkeleton from '../components/common/CardSkeleton'
import { useAuthStore } from '../store/auth.store'

const pendingInviteCodeStorageKey = 'livetasker.pendingInviteCode'

type ApiErrorResponse = {
  message?: string
}

function savePendingInviteCode(inviteCode: string) {
  try {
    window.localStorage.setItem(pendingInviteCodeStorageKey, inviteCode)
  } catch {
    // Ignore storage failures; the route state still preserves the attempted URL.
  }
}

function clearPendingInviteCode() {
  try {
    window.localStorage.removeItem(pendingInviteCodeStorageKey)
  } catch {
    // Ignore storage failures.
  }
}

function JoinWorkspace() {
  const navigate = useNavigate()
  const { inviteCode } = useParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped)
  const hasAcceptedInvite = useRef(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isBootstrapped || !isAuthenticated || !inviteCode || hasAcceptedInvite.current) {
      return
    }

    const code = inviteCode

    hasAcceptedInvite.current = true

    async function joinWorkspace() {
      try {
        const workspace = await acceptInvite(code)

        clearPendingInviteCode()
        toast.success(`Joined ${workspace.name} successfully.`)
        navigate('/dashboard/workspaces', {
          replace: true,
          state: {
            joinedWorkspaceId: workspace._id,
          },
        })
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        const message =
          axiosError.response?.status === 404
            ? 'This invite link is invalid or the workspace no longer exists.'
            : axiosError.response?.data?.message ?? 'Unable to join this workspace invite.'

        setErrorMessage(message)
        toast.error(message)
      }
    }

    void joinWorkspace()
  }, [inviteCode, isAuthenticated, isBootstrapped, navigate])

  if (!inviteCode) {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
  }

  if (!isBootstrapped) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 text-slate-950">
        <CardSkeleton className="w-full max-w-md" rows={2} />
      </main>
    )
  }

  if (!isAuthenticated) {
    savePendingInviteCode(inviteCode)

    return <Navigate to="/login" replace state={{ from: { pathname: `/join/${inviteCode}` } }} />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 text-slate-950">
      {errorMessage ? (
        <p className="text-sm font-semibold text-slate-500">{errorMessage}</p>
      ) : (
        <CardSkeleton className="w-full max-w-md" rows={2} />
      )}
    </main>
  )
}

export default JoinWorkspace
