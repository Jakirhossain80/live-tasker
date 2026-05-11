import { useQuery } from '@tanstack/react-query'
import { UserPlus, Users } from 'lucide-react'
import { getWorkspaceById, getWorkspaces, type Workspace, type WorkspaceMemberRole } from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import MembersStats from '../../components/members/MembersStats'
import MembersTable from '../../components/members/MembersTable'
import type { Member, MemberRole } from '../../components/members/MemberTableRow'
import QuickInviteCard from '../../components/members/QuickInviteCard'
import UpgradeSeatsCard from '../../components/members/UpgradeSeatsCard'

const avatarClassNames = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function formatRole(role: WorkspaceMemberRole): MemberRole {
  if (role === 'owner') {
    return 'Owner'
  }

  if (role === 'admin') {
    return 'Admin'
  }

  return 'Member'
}

function formatJoinedAt(joinedAt: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(joinedAt))
}

function mapWorkspaceMembers(workspace: Workspace): Member[] {
  return workspace.members.map((member, index) => {
    const user =
      typeof member.user === 'string'
        ? {
            _id: member.user,
            name: 'Workspace Member',
            email: 'Member profile unavailable',
          }
        : member.user

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      initials: getInitials(user.name) || 'WM',
      role: formatRole(member.role),
      status: 'Active',
      note: `Joined ${formatJoinedAt(member.joinedAt)}`,
      avatarClassName: avatarClassNames[index % avatarClassNames.length],
    }
  })
}

function Members() {
  const {
    data: workspaces,
    isLoading: areWorkspacesLoading,
    isError: isWorkspacesError,
    error: workspacesError,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  const selectedWorkspaceId = workspaces?.[0]?._id
  const {
    data: workspace,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useQuery({
    queryKey: ['workspace', selectedWorkspaceId],
    queryFn: () => getWorkspaceById(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })

  const isLoading = areWorkspacesLoading || isWorkspaceLoading
  const hasError = isWorkspacesError || isWorkspaceError
  const error = workspacesError || workspaceError

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <LoadingState title="Loading members" message="Fetching workspace member details." />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="mx-auto max-w-6xl">
        <ErrorState
          title="Could not load members"
          message={error instanceof Error ? error.message : 'Please try again in a moment.'}
          onRetry={() => {
            if (isWorkspacesError) {
              void refetchWorkspaces()
            } else {
              void refetchWorkspace()
            }
          }}
        />
      </div>
    )
  }

  if (!workspaces || workspaces.length === 0 || !workspace) {
    return (
      <div className="mx-auto max-w-6xl">
        <EmptyState
          icon={Users}
          title="No workspace members yet"
          message="Create or join a workspace before members can appear here."
        />
      </div>
    )
  }

  const members = mapWorkspaceMembers(workspace)
  const adminMembers = members.filter((member) => member.role === 'Owner' || member.role === 'Admin').length

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

      <MembersStats totalMembers={members.length} adminMembers={adminMembers} activeMembers={members.length} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {members.length > 0 ? (
            <MembersTable members={members} />
          ) : (
            <EmptyState icon={Users} title="No members yet" message="Workspace members will appear here." />
          )}
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
