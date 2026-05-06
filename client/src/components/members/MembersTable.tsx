import MemberTableRow, { type Member } from './MemberTableRow'

type MembersTableProps = {
  members: Member[]
}

function MembersTable({ members }: MembersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          defaultValue="All Roles"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-40"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Member</option>
          <option>Guest</option>
        </select>
        <p className="text-sm font-medium text-slate-500">Showing 24 members</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <MemberTableRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">Page 1 of 3</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  )
}

export default MembersTable
