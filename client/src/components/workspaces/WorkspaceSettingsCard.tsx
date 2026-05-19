import { useEffect, useState, type FormEvent } from 'react'

type WorkspaceSettingsCardProps = {
  name?: string
  description?: string
  isArchived?: boolean
  isSubmitting?: boolean
  isDeleting?: boolean
  canSave?: boolean
  canDelete?: boolean
  successMessage?: string
  errorMessage?: string
  permissionMessage?: string
  onSave: (payload: { name: string; description: string; isArchived: boolean }) => void
  onDelete?: () => void
}

function WorkspaceSettingsCard({
  name = 'Product Engineering',
  description = 'Core development and engineering hub for the main platform roadmap.',
  isArchived = false,
  isSubmitting = false,
  isDeleting = false,
  canSave = true,
  canDelete = false,
  successMessage,
  errorMessage,
  permissionMessage,
  onSave,
  onDelete,
}: WorkspaceSettingsCardProps) {
  const [workspaceName, setWorkspaceName] = useState(name)
  const [workspaceDescription, setWorkspaceDescription] = useState(description)
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState(true)

  useEffect(() => {
    setWorkspaceName(name)
    setWorkspaceDescription(description)
  }, [name, description])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      name: workspaceName.trim(),
      description: workspaceDescription.trim(),
      isArchived,
    })
  }

  const isSaveDisabled =
    !canSave || isSubmitting || isDeleting || workspaceName.trim().length < 2 || workspaceName.trim().length > 100

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-slate-950">Workspace Settings</h3>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            type="text"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            disabled={isSubmitting}
            minLength={2}
            maxLength={100}
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea
            value={workspaceDescription}
            onChange={(event) => setWorkspaceDescription(event.target.value)}
            disabled={isSubmitting}
            rows={4}
            maxLength={500}
            className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <div>
            <p className="text-sm font-bold text-slate-950">Privacy Mode</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">Only invited members can join</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isPrivacyModeEnabled}
            aria-label="Privacy Mode"
            onClick={() => setIsPrivacyModeEnabled((value) => !value)}
            className="flex h-7 w-12 shrink-0 items-center rounded-full bg-indigo-600 p-1 shadow-inner transition"
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
                isPrivacyModeEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {permissionMessage ? (
        <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          {permissionMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaveDisabled}
        className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>

      {canDelete && onDelete ? (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete Workspace'}
          </button>
        </div>
      ) : null}
    </form>
  )
}

export default WorkspaceSettingsCard
