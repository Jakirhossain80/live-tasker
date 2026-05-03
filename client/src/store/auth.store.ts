import { create } from 'zustand'

type AuthUser = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, accessToken?: string | null) => void
  setAccessToken: (accessToken: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken = null) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}))
