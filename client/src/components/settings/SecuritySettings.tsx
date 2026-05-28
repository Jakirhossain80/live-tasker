import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { updateMyPassword } from '../../api/auth'

type ApiErrorResponse = {
  message?: string
}

type SecuritySettingsProps = {
  resetSignal: number
}

function SecuritySettings({ resetSignal }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

  useEffect(() => {
    setCurrentPassword('')
    setNewPassword('')
    setMessage('')
    setIsSubmitting(false)
  }, [resetSignal])

  async function handlePasswordUpdate() {
    if (!currentPassword.trim() || !newPassword.trim()) {
      const nextMessage = 'Current password and new password are required.'

      setMessage(nextMessage)
      toast.error(nextMessage)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const result = await updateMyPassword({
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setMessage(result.message || 'Password updated successfully.')
      toast.success(result.message || 'Password updated successfully.')
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        const nextMessage = error.response?.data?.message || error.message || 'Could not update password.'

        setMessage(nextMessage)
        toast.error(nextMessage)
        return
      }

      const nextMessage = error instanceof Error ? error.message : 'Could not update password.'

      setMessage(nextMessage)
      toast.error(nextMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Security</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Current Password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="********"
            className={inputClassName}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Min 12 characters"
            className={inputClassName}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {message ? (
          <p className="text-sm font-medium text-slate-500" role="status">
            {message}
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handlePasswordUpdate}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </section>
  )
}

export default SecuritySettings
