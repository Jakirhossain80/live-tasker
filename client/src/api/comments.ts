import { http } from './http'
import type { TaskUser } from './tasks'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

export type CommentTask = {
  _id: string
  title: string
  status: string
  board: string
  workspace: string
}

export type Comment = {
  _id: string
  task: CommentTask | string
  author: TaskUser | string
  content: string
  isEdited: boolean
  editedAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateCommentPayload = {
  content: string
}

export type UpdateCommentPayload = {
  content: string
}

type CommentsData = {
  comments: Comment[]
}

type CommentData = {
  comment: Comment
}

export async function getComments(taskId: string) {
  const response = await http.get<ApiResponse<CommentsData>>(`/tasks/${taskId}/comments`)

  return response.data.data.comments
}

export async function createComment(taskId: string, payload: CreateCommentPayload) {
  const response = await http.post<ApiResponse<CommentData>>(`/tasks/${taskId}/comments`, payload)

  return response.data.data.comment
}

export async function updateComment(commentId: string, payload: UpdateCommentPayload) {
  const response = await http.patch<ApiResponse<CommentData>>(`/comments/${commentId}`, payload)

  return response.data.data.comment
}

export async function deleteComment(commentId: string) {
  await http.delete(`/comments/${commentId}`)
}
