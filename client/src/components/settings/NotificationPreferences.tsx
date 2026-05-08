import { BellRing, Mail, MessageSquareText, Smartphone } from 'lucide-react'

const preferences = [
  {
    label: 'Email Notifications',
    description: 'Receive daily summaries and critical updates.',
    enabled: true,
    icon: Mail,
  },
  {
    label: 'Desktop Alerts',
    description: 'Real-time task reminders and chat mentions.',
    enabled: true,
    icon: Smartphone,
  },
  {
    label: 'Activity Tracking',
    description: 'Log when projects you follow are updated.',
    enabled: false,
    icon: MessageSquareText,
  },
]

function NotificationPreferences() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Notification Preferences</h3>
          <p className="mt-1 text-sm text-slate-500">Choose how LiveTasker keeps you informed.</p>
        </div>
        <BellRing className="h-5 w-5 text-amber-500" />
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {preferences.map((preference) => {
          const Icon = preference.icon
          const inputId = `notification-${preference.label.toLowerCase().replace(/\s+/g, '-')}`

          return (
            <div key={preference.label} className="flex items-center justify-between gap-4 py-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{preference.label}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{preference.description}</p>
                </div>
              </div>

              <label htmlFor={inputId} className="relative inline-flex cursor-default items-center">
                <input
                  id={inputId}
                  type="checkbox"
                  defaultChecked={preference.enabled}
                  disabled
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-200 peer-focus-visible:ring-offset-2 peer-disabled:opacity-100" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                <span className="sr-only">Toggle {preference.label}</span>
              </label>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default NotificationPreferences
