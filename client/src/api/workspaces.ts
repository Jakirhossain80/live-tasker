import { http } from './http'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

export type WorkspaceMemberRole = 'owner' | 'admin' | 'member'
export type ManageableWorkspaceMemberRole = Exclude<WorkspaceMemberRole, 'owner'>

export type WorkspaceUser = {
  _id: string
  name: string
  email: string
  avatar?: string
}

export type WorkspaceMember = {
  user: WorkspaceUser | string
  role: WorkspaceMemberRole
  joinedAt: string
}

export type Workspace = {
  _id: string
  name: string
  description?: string
  owner: WorkspaceUser | string
  members: WorkspaceMember[]
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CreateWorkspacePayload = {
  name: string
  description?: string
}

export type UpdateWorkspacePayload = Partial<{
  name: string
  description: string
  isArchived: boolean
}>

export type AddWorkspaceMemberPayload = {
  userId: string
  role?: ManageableWorkspaceMemberRole
}

export type UpdateWorkspaceMemberPayload = {
  role: ManageableWorkspaceMemberRole
}

type WorkspacesData = {
  workspaces: Workspace[]
}

type WorkspaceData = {
  workspace: Workspace
}

export async function getWorkspaces() {
  const response = await http.get<ApiResponse<WorkspacesData>>('/workspaces')

  return response.data.data.workspaces
}

export async function getWorkspaceById(workspaceId: string) {
  const response = await http.get<ApiResponse<WorkspaceData>>(`/workspaces/${workspaceId}`)

  return response.data.data.workspace
}

export async function createWorkspace(payload: CreateWorkspacePayload) {
  const response = await http.post<ApiResponse<WorkspaceData>>('/workspaces', payload)

  return response.data.data.workspace
}

export async function updateWorkspace(workspaceId: string, payload: UpdateWorkspacePayload) {
  const response = await http.patch<ApiResponse<WorkspaceData>>(`/workspaces/${workspaceId}`, payload)

  return response.data.data.workspace
}

export async function addWorkspaceMember(workspaceId: string, payload: AddWorkspaceMemberPayload) {
  const response = await http.post<ApiResponse<WorkspaceData>>(`/workspaces/${workspaceId}/members`, payload)

  return response.data.data.workspace
}

export async function updateWorkspaceMember(
  workspaceId: string,
  userId: string,
  payload: UpdateWorkspaceMemberPayload,
) {
  const response = await http.patch<ApiResponse<WorkspaceData>>(`/workspaces/${workspaceId}/members/${userId}`, payload)

  return response.data.data.workspace
}

export async function removeWorkspaceMember(workspaceId: string, userId: string) {
  await http.delete(`/workspaces/${workspaceId}/members/${userId}`)
}
