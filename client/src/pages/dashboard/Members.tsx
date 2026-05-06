import { UserPlus } from 'lucide-react'
import MembersStats from '../../components/members/MembersStats'
import MembersTable from '../../components/members/MembersTable'
import type { Member } from '../../components/members/MemberTableRow'
import QuickInviteCard from '../../components/members/QuickInviteCard'
import UpgradeSeatsCard from '../../components/members/UpgradeSeatsCard'

const members: Member[] = [
  {
    id: 1,
    name: 'Sarah Connor',
    email: 'sarah.c@livetasker.com',
    initials: 'SC',
    role: 'Admin',
    status: 'Active',
    note: 'Last active: 2m ago',
    avatarClassName: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james.w@livetasker.com',
    initials: 'JW',
    role: 'Member',
    status: 'Active',
    avatarClassName: 'bg-emerald-100 text-emerald-700',
    note: 'Last active: 1h ago',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    email: 'elena.r@livetasker.com',
    initials: 'ER',
    role: 'Member',
    status: 'Away',
    note: 'Last active: Yesterday',
    avatarClassName: 'bg-sky-100 text-sky-700',
  },
  {
    id: 4,
    name: 'Marcus Chen',
    email: 'marcus.c@livetasker.com',
    initials: 'MC',
    role: 'Member',
    status: 'Pending',
    note: 'Invited: 2 days ago',
    avatarClassName: 'bg-amber-100 text-amber-700',
  },
]

function Members() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Workspace Members</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your team members, roles, and workspace access.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </section>

      <MembersStats />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <MembersTable members={members} />
        </div>

        <aside className="space-y-4">
          <QuickInviteCard />
          <UpgradeSeatsCard />
        </aside>
      </section>
    </div>
  )
}

export default Members
