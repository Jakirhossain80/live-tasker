import { MoreVertical } from 'lucide-react'
import MemberStatusBadge, { type MemberStatus } from './MemberStatusBadge'

export type MemberRole = 'Admin' | 'Member' | 'Guest'

export type Member = {
  id: number
  name: string
  email: string
  initials: string
  role: MemberRole
  status: MemberStatus
  note: string
  avatarClassName: string
}

type MemberTableRowProps = {
  member: Member
}

function MemberTableRow({ member }: MemberTableRowProps) {
  return (
    <tr className="border-t border-slate-100 bg-white transition hover:bg-indigo-50/40">
      <td className="min-w-[280px] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${member.avatarClassName}`}
          >
            {member.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{member.name}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{member.note}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium text-slate-600">{member.email}</span>
      </td>
      <td className="px-5 py-4">
        <MemberStatusBadge status={member.status} />
      </td>
      <td className="px-5 py-4">
        <select
          defaultValue={member.role}
          aria-label={`Role for ${member.name}`}
          className="rounded-lg border-0 bg-transparent px-0 py-1 text-sm font-semibold text-slate-700 outline-none transition hover:text-indigo-600 focus:text-indigo-600 focus:ring-0"
        >
          <option>Admin</option>
          <option>Member</option>
          <option>Guest</option>
        </select>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label={`More options for ${member.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

export default MemberTableRow
