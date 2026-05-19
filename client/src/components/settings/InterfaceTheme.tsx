import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

type ThemePreference = 'light' | 'dark' | 'system'

const themeOptions = [
  { label: 'Light Mode', value: 'light', icon: Sun },
  { label: 'Dark Mode', value: 'dark', icon: Moon },
  { label: 'System Sync', value: 'system', icon: Monitor },
] satisfies Array<{
  label: string
  value: ThemePreference
  icon: typeof Sun
}>

const THEME_STORAGE_KEY = 'livetasker-theme'

function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system'
}

function InterfaceTheme() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(getStoredThemePreference)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function applyTheme() {
      const shouldUseDarkMode =
        themePreference === 'dark' ||
        (themePreference === 'system' && darkModeMediaQuery.matches)

      document.documentElement.classList.toggle('dark', shouldUseDarkMode)
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
    applyTheme()

    if (themePreference !== 'system') {
      return
    }

    darkModeMediaQuery.addEventListener('change', applyTheme)

    return () => {
      darkModeMediaQuery.removeEventListener('change', applyTheme)
    }
  }, [themePreference])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">Interface Theme</h3>

      <div className="mt-5 grid gap-3">
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isActive = option.value === themePreference

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setThemePreference(option.value)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={isActive}
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
