import { Bell, ChevronRight, KeyRound, Pencil } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ProfileQuickAction = {
  id: 'edit-profile' | 'change-password' | 'manage-notifications'
  label: string
  icon: LucideIcon
}

type ProfileQuickActionsProps = {
  actions: ProfileQuickAction[]
  onActionClick: (action: ProfileQuickAction) => void
}

function ProfileQuickActions({ actions, onActionClick }: ProfileQuickActionsProps) {
  const fallbackActions =
    actions.length > 0
      ? actions
      : [
          { id: 'edit-profile', label: 'Edit Profile', icon: Pencil },
          { id: 'change-password', label: 'Change Password', icon: KeyRound },
          { id: 'manage-notifications', label: 'Manage Notifications', icon: Bell },
        ] satisfies ProfileQuickAction[]

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Quick Actions</h3>

      <div className="mt-5 grid gap-3">
        {fallbackActions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => onActionClick(action)}
              className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:bg-slate-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:text-indigo-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-950">{action.label}</span>
              <span className="shrink-0 text-slate-400">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ProfileQuickActions
