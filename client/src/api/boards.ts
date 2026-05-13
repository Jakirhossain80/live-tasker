import { http } from './http'
import type { Workspace } from './workspaces'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

export type BoardColumn = {
  _id: string
  title: string
  order: number
}

export type BoardUser = {
  _id: string
  name: string
  email: string
  avatar?: string
}

export type Board = {
  _id: string
  workspace: Pick<Workspace, '_id' | 'name' | 'description' | 'owner' | 'isArchived'> | string
  name: string
  description?: string
  columns: BoardColumn[]
  createdBy: BoardUser | string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CreateBoardPayload = {
  workspaceId: string
  name: string
  description?: string
  columns?: CreateBoardColumnPayload[]
}

export type CreateBoardColumnPayload = {
  title: string
  order: number
}

export type UpdateBoardPayload = Partial<{
  name: string
  description: string
  columns: CreateBoardColumnPayload[]
  isArchived: boolean
}>

type BoardsData = {
  boards: Board[]
}

type BoardData = {
  board: Board
}

export function isValidBoardId(boardId?: string | null) {
  return Boolean(boardId && /^[a-f\d]{24}$/i.test(boardId))
}

export async function getBoards(workspaceId: string) {
  const response = await http.get<ApiResponse<BoardsData>>(`/workspaces/${workspaceId}/boards`)

  return response.data.data.boards
}

export async function getBoardById(boardId: string) {
  if (!isValidBoardId(boardId)) {
    throw new Error('Invalid board id.')
  }

  const response = await http.get<ApiResponse<BoardData>>(`/boards/${boardId}`)

  return response.data.data.board
}

export async function createBoard(payload: CreateBoardPayload) {
  const { workspaceId, ...boardPayload } = payload
  const response = await http.post<ApiResponse<BoardData>>(`/workspaces/${workspaceId}/boards`, boardPayload)

  return response.data.data.board
}

export async function updateBoard(boardId: string, payload: UpdateBoardPayload) {
  const response = await http.patch<ApiResponse<BoardData>>(`/boards/${boardId}`, payload)

  return response.data.data.board
}

export async function deleteBoard(boardId: string) {
  await http.delete(`/boards/${boardId}`)
}
