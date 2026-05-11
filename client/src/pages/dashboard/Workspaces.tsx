import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { FolderKanban } from 'lucide-react'
import {
  createWorkspace,
  getWorkspaces,
  type CreateWorkspacePayload,
  type Workspace,
  type WorkspaceMemberRole as ApiWorkspaceMemberRole,
} from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import CreateWorkspaceModal from '../../components/workspaces/CreateWorkspaceModal'
import DataAccessCard from '../../components/workspaces/DataAccessCard'
import WorkspaceHeader from '../../components/workspaces/WorkspaceHeader'
import WorkspaceMembersTable from '../../components/workspaces/WorkspaceMembersTable'
import WorkspaceSettingsCard from '../../components/workspaces/WorkspaceSettingsCard'
import type { WorkspaceMember, WorkspaceMemberRole } from '../../components/workspaces/WorkspaceMemberRow'

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

function formatRole(role: ApiWorkspaceMemberRole): WorkspaceMemberRole {
  if (role === 'owner') {
    return 'Owner'
  }

  if (role === 'admin') {
    return 'Admin'
  }

  return 'Member'
}

function mapWorkspaceMembers(workspace: Workspace): WorkspaceMember[] {
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
      avatarClassName: avatarClassNames[index % avatarClassNames.length],
    }
  })
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : 'Could not create workspace.'
}

function Workspaces() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createErrorMessage, setCreateErrorMessage] = useState<string>()
  const {
    data: workspaces,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: async () => {
      setIsCreateModalOpen(false)
      setCreateErrorMessage(undefined)
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (mutationError) => {
      setCreateErrorMessage(getErrorMessage(mutationError))
    },
  })

  function openCreateModal() {
    setCreateErrorMessage(undefined)
    setIsCreateModalOpen(true)
  }

  function closeCreateModal() {
    if (!createWorkspaceMutation.isPending) {
      setIsCreateModalOpen(false)
      setCreateErrorMessage(undefined)
    }
  }

  function handleCreateWorkspace(payload: CreateWorkspacePayload) {
    setCreateErrorMessage(undefined)
    createWorkspaceMutation.mutate(payload)
  }

  const createWorkspaceModal = (
    <CreateWorkspaceModal
      isOpen={isCreateModalOpen}
      isSubmitting={createWorkspaceMutation.isPending}
      errorMessage={createErrorMessage}
      onClose={closeCreateModal}
      onSubmit={handleCreateWorkspace}
    />
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <LoadingState title="Loading workspaces" message="Fetching your workspace and team members." />
        {createWorkspaceModal}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not load workspaces"
          message={error instanceof Error ? error.message : 'Please try again in a moment.'}
          onRetry={() => {
            void refetch()
          }}
        />
        {createWorkspaceModal}
      </div>
    )
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <EmptyState
          icon={FolderKanban}
          title="No workspaces yet"
          message="Create a workspace to start organizing boards, tasks, and teammates."
          actionLabel="Create Workspace"
          onAction={openCreateModal}
        />
        {createWorkspaceModal}
      </div>
    )
  }

  const workspace = workspaces[0]
  const members = mapWorkspaceMembers(workspace)

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <WorkspaceHeader
        title={workspace.name}
        subtitle={workspace.description || 'Manage your team members and workspace preferences.'}
        actionLabel="Create Workspace"
        onAction={openCreateModal}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <WorkspaceMembersTable members={members} />

        <aside className="space-y-6">
          <WorkspaceSettingsCard
            name={workspace.name}
            description={workspace.description || 'No workspace description has been added yet.'}
          />
          <DataAccessCard />
        </aside>
      </section>

      {createWorkspaceModal}
    </div>
  )
}

export default Workspaces
