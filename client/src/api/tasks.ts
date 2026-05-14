import { http } from './http'
import { isValidBoardId, type Board } from './boards'
import type { Workspace } from './workspaces'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskUser = {
  _id: string
  name: string
  email: string
  avatar?: string
}

export type Task = {
  _id: string
  workspace: Pick<Workspace, '_id' | 'name' | 'description' | 'owner' | 'isArchived'> | string
  board: Pick<Board, '_id' | 'name' | 'description' | 'columns' | 'isArchived'> | string
  status: string
  title: string
  description?: string
  assignees: TaskUser[]
  priority: TaskPriority
  dueDate?: string
  labels: string[]
  order: number
  createdBy: TaskUser | string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CreateTaskPayload = {
  status: string
  title: string
  description?: string
  assignees?: string[]
  priority?: TaskPriority
  dueDate?: string | null
  labels?: string[]
  order?: number
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>

export type MoveTaskPayload = {
  status: string
  order: number
}

type TasksData = {
  tasks: Task[]
}

type TaskData = {
  task: Task
}

export async function getTasks(boardId: string) {
  if (!isValidBoardId(boardId)) {
    throw new Error('Invalid board id.')
  }

  const response = await http.get<ApiResponse<TasksData>>(`/boards/${boardId}/tasks`)

  return response.data.data.tasks
}

export async function getTaskById(taskId: string) {
  const response = await http.get<ApiResponse<TaskData>>(`/tasks/${taskId}`)

  return response.data.data.task
}

export async function createTask(boardId: string, payload: CreateTaskPayload) {
  if (!isValidBoardId(boardId)) {
    throw new Error('Invalid board id.')
  }

  const response = await http.post<ApiResponse<TaskData>>(`/boards/${boardId}/tasks`, payload)

  return response.data.data.task
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload) {
  const response = await http.patch<ApiResponse<TaskData>>(`/tasks/${taskId}`, payload)

  return response.data.data.task
}

export async function moveTask(taskId: string, payload: MoveTaskPayload) {
  const response = await http.patch<ApiResponse<TaskData>>(`/tasks/${taskId}/move`, payload)

  return response.data.data.task
}

export async function deleteTask(taskId: string) {
  await http.delete(`/tasks/${taskId}`)
}
