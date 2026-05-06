export type MemberStatus = 'Active' | 'Away' | 'Pending' | 'Suspended'

type MemberStatusBadgeProps = {
  status: MemberStatus
}

const statusStyles: Record<MemberStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Away: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  Pending: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  Suspended: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

export default MemberStatusBadge
