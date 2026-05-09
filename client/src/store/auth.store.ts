import { create } from 'zustand'
import { logoutUser, type AuthUser } from '../api/auth'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isBootstrapped: boolean
  setAuth: (user: AuthUser, accessToken: string) => void
  setAccessToken: (accessToken: string | null) => void
  setUser: (user: AuthUser | null) => void
  setBootstrapped: (value: boolean) => void
  clearAuth: () => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isBootstrapped: false,
  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(state.user && accessToken),
    })),
  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: Boolean(user && state.accessToken),
    })),
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
  logout: async () => {
    try {
      await logoutUser()
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      })
    }
  },
}))
