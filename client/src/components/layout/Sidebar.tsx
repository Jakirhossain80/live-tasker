import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  Columns3,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  SquareCheckBig,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, NavLink, matchPath, useLocation } from 'react-router-dom'
import { getBoards, isValidBoardId } from '../../api/boards'
import { getWorkspaces } from '../../api/workspaces'

type NavigationItem = {
  label: string
  icon: LucideIcon
  to: string
  activePaths?: string[]
}

type SidebarProps = {
  isMobileOpen?: boolean
  onClose?: () => void
}

const selectedWorkspaceStorageKey = 'livetasker:selectedWorkspaceId'

function getSavedWorkspaceId() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    return window.localStorage.getItem(selectedWorkspaceStorageKey) || undefined
  } catch {
    return undefined
  }
}

function getNavigationItems(): NavigationItem[] {
  return [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'My Tasks', icon: SquareCheckBig, to: '/dashboard/my-tasks' },
    { label: 'Boards', icon: Columns3, to: '/dashboard/boards', activePaths: ['/dashboard/boards', '/dashboard/boards/:boardId'] },
  { label: 'Members', icon: Users, to: '/dashboard/members' },
  { label: 'Workspaces', icon: FolderKanban, to: '/dashboard/workspaces', activePaths: ['/dashboard/workspaces'] },
  { label: 'Activity', icon: Activity, to: '/dashboard/activity' },
  { label: 'Profile', icon: UserRound, to: '/dashboard/profile' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
  ]
}

function isNavigationItemActive(item: NavigationItem, pathname: string) {
  if (item.activePaths) {
    return item.activePaths.some((activePath) => matchPath({ path: activePath, end: true }, pathname))
  }

  return matchPath({ path: item.to, end: item.to === '/dashboard' }, pathname)
}

function Sidebar({ isMobileOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })
  const activeWorkspaces = workspaces?.filter((workspace) => !workspace.isArchived) ?? []
  const savedWorkspaceId = getSavedWorkspaceId()
  const selectedWorkspace =
    activeWorkspaces.find((workspace) => workspace._id === savedWorkspaceId) ?? activeWorkspaces[0]
  const selectedWorkspaceId = selectedWorkspace?._id
  const { data: boards } = useQuery({
    queryKey: ['boards', selectedWorkspaceId],
    queryFn: () => getBoards(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })
  const selectedBoardId = boards?.find((board) => !board.isArchived && board._id !== 'demo-board' && isValidBoardId(board._id))?._id
  const boardRouteMatch = matchPath({ path: '/dashboard/boards/:boardId', end: true }, location.pathname)
  const routeBoardId = boardRouteMatch?.params.boardId
  const newTaskBoardId =
    routeBoardId && routeBoardId !== 'demo-board' && isValidBoardId(routeBoardId) ? routeBoardId : selectedBoardId
  const navigationItems = getNavigationItems()

  return (
    <>
      {isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-16 z-30 bg-slate-900/30 md:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 flex w-[280px] flex-col border-r border-slate-200 bg-white shadow-sm transition-transform md:flex md:flex-col md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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

        {newTaskBoardId ? (
          <Link
            to={`/dashboard/boards/${newTaskBoardId}`}
            state={{ openCreateTask: true }}
            onClick={onClose}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="Create a board before adding tasks."
            className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white opacity-60 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = Boolean(isNavigationItemActive(item, location.pathname))

          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={() =>
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
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
        >
          <CircleHelp className="h-5 w-5" />
          Help & Feedback
        </NavLink>
      </div>
      </aside>
    </>
  )
}

export default Sidebar
