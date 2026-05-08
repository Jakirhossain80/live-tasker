import {
  Activity,
  Columns3,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  SquareCheckBig,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'My Tasks', icon: SquareCheckBig, to: '/dashboard/my-tasks' },
  { label: 'Boards', icon: Columns3, to: '/dashboard/boards/main-board' },
  { label: 'Members', icon: Users, to: '/dashboard/members' },
  { label: 'Workspaces', icon: FolderKanban, to: '/workspaces' },
  { label: 'Activity', icon: Activity, to: '/dashboard/activity' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
]

function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[280px] border-r border-slate-200 bg-white shadow-sm md:flex md:flex-col">
      <div className="px-4 py-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Main Workspace</p>
              <p className="text-xs text-slate-500">6 active members</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-4 px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <NavLink
          to="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
        >
          <CircleHelp className="h-5 w-5" />
          Help & Feedback
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
