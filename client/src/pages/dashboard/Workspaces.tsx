import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { FolderKanban, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createBoard, getBoards, isValidBoardId, type CreateBoardPayload } from '../../api/boards'
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspace,
  type CreateWorkspacePayload,
  type UpdateWorkspacePayload,
  type Workspace,
  type WorkspaceMemberRole as ApiWorkspaceMemberRole,
} from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import PageSkeleton from '../../components/common/PageSkeleton'
import TableSkeleton from '../../components/common/TableSkeleton'
import CreateBoardModal from '../../components/workspaces/CreateBoardModal'
import CreateWorkspaceModal from '../../components/workspaces/CreateWorkspaceModal'
import DataAccessCard from '../../components/workspaces/DataAccessCard'
import WorkspaceHeader from '../../components/workspaces/WorkspaceHeader'
import WorkspaceMembersTable from '../../components/workspaces/WorkspaceMembersTable'
import WorkspaceSelector from '../../components/workspaces/WorkspaceSelector'
import WorkspaceSettingsCard from '../../components/workspaces/WorkspaceSettingsCard'
import { useAuthStore } from '../../store/auth.store'
import type { WorkspaceMember, WorkspaceMemberRole } from '../../components/workspaces/WorkspaceMemberRow'

const avatarClassNames = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]
const selectedWorkspaceStorageKey = 'livetasker:selectedWorkspaceId'

function getSavedWorkspaceId() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    return window.localStorage.getItem(selectedWorkspaceStorageKey) || undefined
  } catch {
    return undefined
  }
}

function saveWorkspaceId(workspaceId: string) {
  try {
    window.localStorage.setItem(selectedWorkspaceStorageKey, workspaceId)
  } catch {
    // Ignore storage failures so workspace selection still works in memory.
  }
}

function clearSavedWorkspaceId() {
  try {
    window.localStorage.removeItem(selectedWorkspaceStorageKey)
  } catch {
    // Ignore storage failures so empty-workspace state can render normally.
  }
}

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

function getWorkspaceMemberUserId(member: Workspace['members'][number]) {
  return typeof member.user === 'string' ? member.user : member.user._id
}

function canUserUpdateWorkspaceSettings(workspace: Workspace, userId?: string) {
  if (!userId) {
    return false
  }

  const member = workspace.members.find((workspaceMember) => getWorkspaceMemberUserId(workspaceMember) === userId)

  return member?.role === 'owner' || member?.role === 'admin'
}

function canUserDeleteWorkspace(workspace: Workspace, userId?: string) {
  if (!userId) {
    return false
  }

  const member = workspace.members.find((workspaceMember) => getWorkspaceMemberUserId(workspaceMember) === userId)

  return member?.role === 'owner'
}

function getErrorMessage(error: unknown, fallbackMessage = 'Could not complete request.') {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : fallbackMessage
}

function Workspaces() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false)
  const [createErrorMessage, setCreateErrorMessage] = useState<string>()
  const [createBoardErrorMessage, setCreateBoardErrorMessage] = useState<string>()
  const [createBoardSuccessMessage, setCreateBoardSuccessMessage] = useState<string>()
  const [updateWorkspaceSuccessMessage, setUpdateWorkspaceSuccessMessage] = useState<string>()
  const [updateWorkspaceErrorMessage, setUpdateWorkspaceErrorMessage] = useState<string>()
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | undefined>(() => getSavedWorkspaceId())
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
  const activeWorkspaces = workspaces?.filter((workspace) => !workspace.isArchived)
  const selectedWorkspace =
    activeWorkspaces?.find((workspace) => workspace._id === selectedWorkspaceId) ?? activeWorkspaces?.[0]
  const selectedWorkspaceBoardId = selectedWorkspace?._id
  const {
    data: workspaceBoards = [],
    isLoading: areBoardsLoading,
    isError: isBoardsError,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery({
    queryKey: ['boards', selectedWorkspaceBoardId],
    queryFn: () => getBoards(selectedWorkspaceBoardId as string),
    enabled: Boolean(selectedWorkspaceBoardId),
  })
  const activeWorkspaceBoards = workspaceBoards.filter(
    (board) => !board.isArchived && board._id !== 'demo-board' && isValidBoardId(board._id),
  )

  useEffect(() => {
    const availableWorkspaces = workspaces?.filter((workspace) => !workspace.isArchived)

    if (!availableWorkspaces || availableWorkspaces.length === 0) {
      setSelectedWorkspaceId(undefined)
      clearSavedWorkspaceId()
      return
    }

    const savedWorkspaceId = getSavedWorkspaceId()
    const workspaceIdToRestore =
      savedWorkspaceId && availableWorkspaces.some((workspace) => workspace._id === savedWorkspaceId)
        ? savedWorkspaceId
        : availableWorkspaces[0]._id
    const selectedWorkspaceStillExists = availableWorkspaces.some((workspace) => workspace._id === selectedWorkspaceId)

    if (!selectedWorkspaceId || !selectedWorkspaceStillExists) {
      setSelectedWorkspaceId(workspaceIdToRestore)
      saveWorkspaceId(workspaceIdToRestore)
    }
  }, [selectedWorkspaceId, workspaces])

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: async (workspace) => {
      setIsCreateModalOpen(false)
      setCreateErrorMessage(undefined)
      queryClient.setQueryData<Workspace[]>(['workspaces'], (currentWorkspaces) => {
        if (!currentWorkspaces) {
          return [workspace]
        }

        if (currentWorkspaces.some((currentWorkspace) => currentWorkspace._id === workspace._id)) {
          return currentWorkspaces
        }

        return [workspace, ...currentWorkspaces]
      })
      setSelectedWorkspaceId(workspace._id)
      saveWorkspaceId(workspace._id)
      toast.success(`Workspace "${workspace.name}" created.`)
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError, 'Could not create workspace.')

      setCreateErrorMessage(message)
      toast.error(message)
    },
  })
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: async (board, variables) => {
      if (!isValidBoardId(board._id)) {
        const message = 'The board was created, but the server returned an invalid board id.'

        setCreateBoardErrorMessage(message)
        toast.error(message)
        return
      }

      setIsCreateBoardModalOpen(false)
      setCreateBoardErrorMessage(undefined)
      setCreateBoardSuccessMessage(`Board "${board.name}" created successfully.`)
      toast.success(`Board "${board.name}" created.`)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspaces'] }),
        queryClient.invalidateQueries({ queryKey: ['boards', variables.workspaceId] }),
      ])
      void navigate(`/dashboard/boards/${board._id}`)
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError, 'Could not create board.')

      setCreateBoardSuccessMessage(undefined)
      setCreateBoardErrorMessage(message)
      toast.error(message)
    },
  })
  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ workspaceId, payload }: { workspaceId: string; payload: UpdateWorkspacePayload }) =>
      updateWorkspace(workspaceId, payload),
    onSuccess: async (updatedWorkspace) => {
      queryClient.setQueryData(['workspace', updatedWorkspace._id], updatedWorkspace)
      queryClient.setQueryData<Workspace[]>(['workspaces'], (currentWorkspaces) => {
        if (!currentWorkspaces) {
          return currentWorkspaces
        }

        return currentWorkspaces.map((currentWorkspace) =>
          currentWorkspace._id === updatedWorkspace._id ? updatedWorkspace : currentWorkspace,
        )
      })

      setUpdateWorkspaceErrorMessage(undefined)
      setUpdateWorkspaceSuccessMessage('Workspace settings updated successfully.')
      toast.success('Workspace settings updated.')

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspace', updatedWorkspace._id] }),
        queryClient.invalidateQueries({ queryKey: ['workspaces'] }),
      ])
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError, 'Could not update workspace settings.')

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
    },
  })
  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: async (archivedWorkspace) => {
      const archivedWorkspaceId = archivedWorkspace._id
      let remainingWorkspaces: Workspace[] = []

      queryClient.setQueryData<Workspace[]>(['workspaces'], (currentWorkspaces) => {
        const nextWorkspaces = (currentWorkspaces ?? []).filter(
          (currentWorkspace) => currentWorkspace._id !== archivedWorkspaceId,
        )
        remainingWorkspaces = nextWorkspaces.filter((currentWorkspace) => !currentWorkspace.isArchived)

        return nextWorkspaces
      })

      const nextWorkspaceId = remainingWorkspaces[0]?._id

      if (nextWorkspaceId) {
        setSelectedWorkspaceId(nextWorkspaceId)
        saveWorkspaceId(nextWorkspaceId)
      } else {
        setSelectedWorkspaceId(undefined)
        clearSavedWorkspaceId()
      }

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(undefined)

      const refetchResult = await refetch()
      const refetchedActiveWorkspaces = refetchResult.data?.filter((workspace) => !workspace.isArchived) ?? []

      queryClient.setQueryData<Workspace[]>(['workspaces'], refetchedActiveWorkspaces)

      const finalWorkspaceId =
        refetchedActiveWorkspaces.find((workspace) => workspace._id === nextWorkspaceId)?._id ??
        refetchedActiveWorkspaces[0]?._id

      if (finalWorkspaceId) {
        setSelectedWorkspaceId(finalWorkspaceId)
        saveWorkspaceId(finalWorkspaceId)
      } else {
        setSelectedWorkspaceId(undefined)
        clearSavedWorkspaceId()
      }

      toast.success('Workspace deleted.')
    },
    onError: (mutationError) => {
      const message = getErrorMessage(mutationError, 'Could not delete workspace.')

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
    },
  })

  function getWorkspaceId() {
    return selectedWorkspace?._id
  }

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

  function openCreateBoardModal() {
    setCreateBoardErrorMessage(undefined)
    setCreateBoardSuccessMessage(undefined)
    setIsCreateBoardModalOpen(true)
  }

  function closeCreateBoardModal() {
    if (!createBoardMutation.isPending) {
      setIsCreateBoardModalOpen(false)
      setCreateBoardErrorMessage(undefined)
    }
  }

  function handleCreateBoard(payload: Omit<CreateBoardPayload, 'workspaceId' | 'columns'>) {
    const workspaceId = getWorkspaceId()

    if (!workspaceId) {
      const message = 'Select a workspace before creating a board.'

      setCreateBoardErrorMessage(message)
      toast.error(message)
      return
    }

    setCreateBoardErrorMessage(undefined)
    const boardPayload: CreateBoardPayload = {
      workspaceId,
      name: payload.name,
    }

    if (payload.description !== undefined) {
      boardPayload.description = payload.description
    }

    createBoardMutation.mutate(boardPayload)
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
  const createBoardModal = (
    <CreateBoardModal
      isOpen={isCreateBoardModalOpen}
      isSubmitting={createBoardMutation.isPending}
      errorMessage={createBoardErrorMessage}
      onClose={closeCreateBoardModal}
      onSubmit={handleCreateBoard}
    />
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <PageSkeleton className="max-w-[1440px]" showTable />
        {createWorkspaceModal}
        {createBoardModal}
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
        {createBoardModal}
      </div>
    )
  }

  if (!activeWorkspaces || activeWorkspaces.length === 0) {
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
        {createBoardModal}
      </div>
    )
  }

  const workspace = selectedWorkspace

  if (!workspace) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not select workspace"
          message="Please refresh the workspace list and try again."
          onRetry={() => {
            void refetch()
          }}
        />
        {createWorkspaceModal}
        {createBoardModal}
      </div>
    )
  }

  const members = mapWorkspaceMembers(workspace)
  const canUpdateWorkspaceSettings = canUserUpdateWorkspaceSettings(workspace, currentUser?.id)
  const canDeleteWorkspace = canUserDeleteWorkspace(workspace, currentUser?.id)
  const permissionMessage = canUpdateWorkspaceSettings
    ? undefined
    : 'Only workspace owners or admins can update workspace settings.'

  function handleUpdateWorkspace(payload: UpdateWorkspacePayload) {
    const workspaceId = getWorkspaceId()

    if (!canUpdateWorkspaceSettings) {
      const message = permissionMessage ?? 'Only workspace owners or admins can update workspace settings.'

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
      return
    }

    if (!workspaceId) {
      const message = 'Select a workspace before updating settings.'

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
      return
    }

    setUpdateWorkspaceSuccessMessage(undefined)
    setUpdateWorkspaceErrorMessage(undefined)
    updateWorkspaceMutation.mutate({
      workspaceId,
      payload,
    })
  }

  function handleDeleteWorkspace() {
    const workspaceId = getWorkspaceId()

    if (!canDeleteWorkspace) {
      const message = 'Only workspace owners can delete workspaces.'

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
      return
    }

    if (!workspaceId) {
      const message = 'Select a workspace before deleting it.'

      setUpdateWorkspaceSuccessMessage(undefined)
      setUpdateWorkspaceErrorMessage(message)
      toast.error(message)
      return
    }

    const shouldDeleteWorkspace = window.confirm('Are you sure you want to delete/archive this workspace?')

    if (!shouldDeleteWorkspace) {
      return
    }

    setUpdateWorkspaceSuccessMessage(undefined)
    setUpdateWorkspaceErrorMessage(undefined)
    deleteWorkspaceMutation.mutate(workspaceId)
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <WorkspaceHeader
          title={workspace.name}
          subtitle={workspace.description || 'Manage your team members and workspace preferences.'}
          actionLabel="Create Workspace"
          onAction={openCreateModal}
        />
        <WorkspaceSelector
          workspaces={activeWorkspaces}
          selectedWorkspaceId={workspace._id}
          onChange={(workspaceId) => {
            setSelectedWorkspaceId(workspaceId)
            saveWorkspaceId(workspaceId)
            setCreateBoardSuccessMessage(undefined)
            setCreateBoardErrorMessage(undefined)
            setUpdateWorkspaceSuccessMessage(undefined)
            setUpdateWorkspaceErrorMessage(undefined)
          }}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">Workspace Boards</h3>
            <p className="mt-1 text-sm text-slate-500">Create a board to organize tasks, columns, and delivery work.</p>
            {createBoardSuccessMessage ? (
              <p className="mt-2 text-sm font-semibold text-emerald-700">{createBoardSuccessMessage}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={openCreateBoardModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Board
          </button>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          {areBoardsLoading ? (
            <TableSkeleton columns={3} rows={2} showHeader={false} className="shadow-none" />
          ) : null}

          {isBoardsError ? (
            <div className="flex flex-col gap-3 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-rose-700">
                {boardsError instanceof Error ? boardsError.message : 'Could not load boards.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  void refetchBoards()
                }}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!areBoardsLoading && !isBoardsError && activeWorkspaceBoards.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">No boards yet</p>
              <p className="mt-1 text-sm text-slate-500">Create a board to start organizing this workspace.</p>
            </div>
          ) : null}

          {!areBoardsLoading && !isBoardsError && activeWorkspaceBoards.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeWorkspaceBoards.map((board) => (
                <button
                  key={board._id}
                  type="button"
                  onClick={() => {
                    void navigate(`/dashboard/boards/${board._id}`)
                  }}
                  className="group rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{board.name}</p>
                      {board.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{board.description}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                      Open Board
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <WorkspaceMembersTable members={members} />

        <aside className="space-y-6">
          <WorkspaceSettingsCard
            name={workspace.name}
            description={workspace.description || ''}
            isArchived={workspace.isArchived}
            isSubmitting={updateWorkspaceMutation.isPending}
            isDeleting={deleteWorkspaceMutation.isPending}
            canSave={canUpdateWorkspaceSettings}
            canDelete={canDeleteWorkspace}
            successMessage={updateWorkspaceSuccessMessage}
            errorMessage={updateWorkspaceErrorMessage}
            permissionMessage={permissionMessage}
            onSave={handleUpdateWorkspace}
            onDelete={handleDeleteWorkspace}
          />
          <DataAccessCard />
        </aside>
      </section>

      {createWorkspaceModal}
      {createBoardModal}
    </div>
  )
}

export default Workspaces
