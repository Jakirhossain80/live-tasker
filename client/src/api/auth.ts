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
