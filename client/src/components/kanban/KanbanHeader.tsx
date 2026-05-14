import { Filter, Plus } from 'lucide-react'
import type { OnlineUser } from '../../hooks/useOnlineUsers'

const fallbackMembers = [
  { name: 'Sarah Chen', initials: 'SC', className: 'bg-indigo-600' },
  { name: 'Alex Rivera', initials: 'AR', className: 'bg-emerald-600' },
  { name: 'Mina Lee', initials: 'ML', className: 'bg-rose-600' },
]

type KanbanHeaderProps = {
  title?: string
  description?: string
  onlineUsers?: OnlineUser[]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function KanbanHeader({ title = 'Kanban Board', description, onlineUsers = [] }: KanbanHeaderProps) {
  const displayedOnlineUsers = onlineUsers.slice(0, 4)
  const hiddenOnlineUserCount = Math.max(0, onlineUsers.length - displayedOnlineUsers.length)

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
        </div>

        <div className="flex -space-x-2">
          {displayedOnlineUsers.length > 0
            ? displayedOnlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-xs font-semibold text-white shadow-sm"
                  title={`${user.name} is online`}
                >
                  {getInitials(user.name)}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
              ))
            : fallbackMembers.map((member) => (
                <div
                  key={member.name}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-sm ${member.className}`}
                  title={member.name}
                >
                  {member.initials}
                </div>
              ))}
          {hiddenOnlineUserCount > 0 ? (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600 shadow-sm"
              title={`${hiddenOnlineUserCount} more online`}
            >
              +{hiddenOnlineUserCount}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Column
        </button>
      </div>
    </section>
  )
}

export default KanbanHeader
