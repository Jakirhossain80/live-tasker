import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const AUTH_REFRESH_EXCLUDED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

function shouldSkipRefresh(url?: string) {
  if (!url) {
    return false
  }

  return AUTH_REFRESH_EXCLUDED_PATHS.some((path) => url.includes(path))
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(async (config) => {
  const { useAuthStore } = await import('../store/auth.store')
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  } else {
    delete config.headers.Authorization
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { refreshAccessToken } = await import('./auth')
      const { useAuthStore } = await import('../store/auth.store')
      const { accessToken } = await refreshAccessToken()

      useAuthStore.getState().setAccessToken(accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return http(originalRequest)
    } catch (refreshError) {
      const { useAuthStore } = await import('../store/auth.store')

      useAuthStore.getState().clearAuth()

      return Promise.reject(refreshError)
    }
  },
)
