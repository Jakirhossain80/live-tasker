import { Monitor, Moon, Sun } from 'lucide-react'

const themeOptions = [
  { label: 'Light Mode', icon: Sun, active: true },
  { label: 'Dark Mode', icon: Moon, active: false },
  { label: 'System Sync', icon: Monitor, active: false },
]

function InterfaceTheme() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Interface Theme</h3>

      <div className="mt-5 grid gap-3">
        {themeOptions.map((option) => {
          const Icon = option.icon

          return (
            <button
              key={option.label}
              type="button"
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                option.active
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default InterfaceTheme
