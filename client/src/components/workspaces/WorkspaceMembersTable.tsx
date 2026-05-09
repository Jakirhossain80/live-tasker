import WorkspaceMemberRow, { type WorkspaceMember } from './WorkspaceMemberRow'

type WorkspaceMembersTableProps = {
  members: WorkspaceMember[]
}

function WorkspaceMembersTable({ members }: WorkspaceMembersTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-950">Team Members</h3>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
            24 Total
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <WorkspaceMemberRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">Showing {members.length} workspace members</p>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          View All Members
        </button>
      </footer>
    </section>
  )
}

export default WorkspaceMembersTable
