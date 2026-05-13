import { http } from './http'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'moved' | 'commented' | 'assigned' | 'completed'

export type ActivityEntityType = 'workspace' | 'board' | 'task' | 'comment'

export type ActivityActor = {
  _id: string
  name: string
  email: string
  avatar?: string
}

export type ActivityBoard = {
  _id: string
  name: string
  description?: string
}

export type ActivityTask = {
  _id: string
  title: string
  status: string
  priority: string
  dueDate?: string
}

export type ActivityLog = {
  _id: string
  workspace: string
  board?: ActivityBoard | string
  task?: ActivityTask | string
  actor: ActivityActor | string
  action: ActivityAction
  entityType: ActivityEntityType
  entityId: string
  message: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

type ActivityData = {
  activity: ActivityLog[]
}

export async function getWorkspaceActivity(workspaceId: string) {
  const response = await http.get<ApiResponse<ActivityData>>(`/workspaces/${workspaceId}/activity`)

  return response.data.data.activity
}
