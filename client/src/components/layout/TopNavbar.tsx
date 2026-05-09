import { Bell, Grid3X3, LogOut, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

function TopNavbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const initials =
    user?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'LT'

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-xl font-bold text-slate-950">LiveTasker</h1>
      </div>

      <div className="hidden w-full max-w-md items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search tasks..."
          className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Apps"
        >
          <Grid3X3 className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {initials}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

export default TopNavbar
