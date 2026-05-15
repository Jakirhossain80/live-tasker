import { UserPlus, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { ManageableWorkspaceMemberRole } from '../../api/workspaces'

export type InviteMemberPayload = {
  email: string
  role: ManageableWorkspaceMemberRole
}

type InviteMemberModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  errorMessage?: string
  onClose: () => void
  onSubmit: (payload: InviteMemberPayload) => void
}

function InviteMemberModal({ isOpen, isSubmitting, errorMessage, onClose, onSubmit }: InviteMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<ManageableWorkspaceMemberRole>('member')

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setRole('member')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return
    }

    onSubmit({
      email: trimmedEmail,
      role,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-950/40 px-4 py-6">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Invite Member</h2>
              <p className="mt-1 text-sm text-slate-500">Add an existing user to this workspace.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close invite member modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
              placeholder="test2@example.com"
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            />
            <span className="mt-2 block text-xs font-medium leading-5 text-slate-500">
              Enter the email address of an existing registered user.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as ManageableWorkspaceMemberRole)}
              disabled={isSubmitting}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {errorMessage ? (
            <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default InviteMemberModal
