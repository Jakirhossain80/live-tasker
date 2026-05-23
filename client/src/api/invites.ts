import { http } from './http'
import type { Workspace } from './workspaces'

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

type AcceptInviteData = {
  workspace: Workspace
}

export async function acceptInvite(inviteCode: string) {
  const response = await http.post<ApiResponse<AcceptInviteData>>(`/workspaces/${inviteCode}/join`)

  return response.data.data.workspace
}
