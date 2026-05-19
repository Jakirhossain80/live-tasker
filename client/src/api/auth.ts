import { http } from './http'

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type RegisterUserPayload = {
  name: string
  email: string
  password: string
}

export type LoginUserPayload = {
  email: string
  password: string
}

export type UpdateMyProfilePayload = {
  name?: string
  email?: string
}

export type UpdateMyPasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type AuthResponse = {
  user: AuthUser
  accessToken: string
}

export type RefreshAccessTokenResponse = {
  user?: AuthUser
  accessToken: string
}

export type CurrentUserResponse = {
  user: AuthUser
}

type ApiResponse<TData> = {
  success: boolean
  message?: string
  data: TData
}

type ApiMessageResponse = {
  success: boolean
  message: string
}

export async function registerUser(payload: RegisterUserPayload) {
  const response = await http.post<ApiResponse<AuthResponse>>('/auth/register', payload)

  return response.data.data
}

export async function loginUser(payload: LoginUserPayload) {
  const response = await http.post<ApiResponse<AuthResponse>>('/auth/login', payload)

  return response.data.data
}

export async function refreshAccessToken() {
  const response = await http.post<ApiResponse<RefreshAccessTokenResponse>>('/auth/refresh')

  return response.data.data
}

export async function logoutUser() {
  await http.post('/auth/logout')
}

export async function getCurrentUser() {
  const response = await http.get<ApiResponse<CurrentUserResponse>>('/auth/me')

  return response.data.data
}

export async function updateMyProfile(payload: UpdateMyProfilePayload) {
  const response = await http.patch<ApiResponse<CurrentUserResponse>>('/auth/me', payload)

  return response.data.data
}

export async function updateMyPassword(payload: UpdateMyPasswordPayload) {
  const response = await http.patch<ApiMessageResponse>('/auth/password', payload)

  return response.data
}
