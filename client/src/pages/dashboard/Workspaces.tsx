import DataAccessCard from '../../components/workspaces/DataAccessCard'
import WorkspaceHeader from '../../components/workspaces/WorkspaceHeader'
import WorkspaceMembersTable from '../../components/workspaces/WorkspaceMembersTable'
import WorkspaceSettingsCard from '../../components/workspaces/WorkspaceSettingsCard'
import type { WorkspaceMember } from '../../components/workspaces/WorkspaceMemberRow'

const members: WorkspaceMember[] = [
  {
    id: 1,
    name: 'Alex Rivera',
    email: 'alex.r@livetasker.com',
    initials: 'AR',
    role: 'Admin',
    status: 'Active',
    avatarClassName: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 's.jenkins@livetasker.com',
    initials: 'SJ',
    role: 'Member',
    status: 'Offline',
    avatarClassName: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    name: 'Marcus Chen',
    email: 'm.chen@livetasker.com',
    initials: 'MC',
    role: 'Member',
    status: 'Active',
    avatarClassName: 'bg-sky-100 text-sky-700',
  },
]

function Workspaces() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <WorkspaceHeader />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <WorkspaceMembersTable members={members} />

        <aside className="space-y-6">
          <WorkspaceSettingsCard />
          <DataAccessCard />
        </aside>
      </section>
    </div>
  )
}

export default Workspaces
