import { MoreVertical } from 'lucide-react'

export type WorkspaceMemberRole = 'Owner' | 'Admin' | 'Member'
export type WorkspaceMemberStatus = 'Active' | 'Offline'

export type WorkspaceMember = {
  id: string
  name: string
  email: string
  initials: string
  role: WorkspaceMemberRole
  status: WorkspaceMemberStatus
  avatarClassName: string
}

const statusClassNames: Record<WorkspaceMemberStatus, string> = {
  Active: 'bg-emerald-500',
  Offline: 'bg-slate-400',
}

const roleClassNames: Record<WorkspaceMemberRole, string> = {
  Owner: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Admin: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  Member: 'bg-slate-100 text-slate-700 ring-slate-200',
}

type WorkspaceMemberRowProps = {
  member: WorkspaceMember
}

function WorkspaceMemberRow({ member }: WorkspaceMemberRowProps) {
  return (
    <tr className="border-t border-slate-100 bg-white transition hover:bg-slate-50">
      <td className="min-w-[280px] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${member.avatarClassName}`}
          >
            {member.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{member.name}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className={`h-2.5 w-2.5 rounded-full ${statusClassNames[member.status]}`} />
          {member.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${roleClassNames[member.role]}`}
        >
          {member.role}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={`More options for ${member.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

export default WorkspaceMemberRow
