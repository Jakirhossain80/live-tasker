import { useQuery } from '@tanstack/react-query'
import { KanbanSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getBoards, isValidBoardId } from '../../api/boards'
import { getWorkspaces } from '../../api/workspaces'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import CardSkeleton from '../../components/common/CardSkeleton'

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

function Boards() {
  const [savedWorkspaceId] = useState(() => getSavedWorkspaceId())
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
  const activeWorkspaces = useMemo(() => workspaces?.filter((workspace) => !workspace.isArchived) ?? [], [workspaces])
  const selectedWorkspace = useMemo(
    () => activeWorkspaces.find((workspace) => workspace._id === savedWorkspaceId) ?? activeWorkspaces[0],
    [activeWorkspaces, savedWorkspaceId],
  )
  const selectedWorkspaceId = selectedWorkspace?._id
  const {
    data: boards = [],
    isLoading: areBoardsLoading,
    isError: isBoardsError,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery({
    queryKey: ['boards', selectedWorkspaceId],
    queryFn: () => getBoards(selectedWorkspaceId as string),
    enabled: Boolean(selectedWorkspaceId),
  })
  const firstBoard = boards.find((board) => !board.isArchived && board._id !== 'demo-board' && isValidBoardId(board._id))

  if (areWorkspacesLoading || areBoardsLoading) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <CardSkeleton rows={4} />
      </div>
    )
  }

  if (isWorkspacesError) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not load workspaces"
          message={workspacesError instanceof Error ? workspacesError.message : 'Please try again in a moment.'}
          onRetry={() => {
            void refetchWorkspaces()
          }}
        />
      </div>
    )
  }

  if (isBoardsError) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <ErrorState
          title="Could not load board"
          message={boardsError instanceof Error ? boardsError.message : 'Please try again in a moment.'}
          onRetry={() => {
            void refetchBoards()
          }}
        />
      </div>
    )
  }

  if (firstBoard) {
    return <Navigate to={`/dashboard/boards/${firstBoard._id}`} replace />
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <EmptyState
        icon={KanbanSquare}
        title="No board selected"
        message="Open a board from a workspace to view its columns."
      />
    </div>
  )
}

export default Boards
