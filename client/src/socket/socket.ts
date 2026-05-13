import { io } from 'socket.io-client'
import { useAuthStore } from '../store/auth.store'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000'

let connectionConsumers = 0
let currentAuthToken: string | null = null

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
})

function setSocketAuth(accessToken: string | null) {
  currentAuthToken = accessToken
  socket.auth = accessToken ? { token: accessToken } : {}
}

function syncSocketAuth() {
  setSocketAuth(useAuthStore.getState().accessToken)
}

useAuthStore.subscribe((state, previousState) => {
  if (state.accessToken === previousState.accessToken) {
    return
  }

  setSocketAuth(state.accessToken)

  if (!state.accessToken) {
    socket.disconnect()
    return
  }

  if (connectionConsumers > 0 && (socket.connected || socket.active)) {
    socket.disconnect()
    socket.connect()
  } else if (connectionConsumers > 0) {
    socket.connect()
  }
})

export type TaskMovedPayload = {
  boardId: string
  taskId: string
  fromStatus: string
  toStatus: string
  order: number
}

export function connectSocket() {
  connectionConsumers += 1
  syncSocketAuth()

  if (!currentAuthToken) {
    return
  }

  if (!socket.connected && !socket.active) {
    socket.connect()
  }
}

export function disconnectSocket() {
  connectionConsumers = Math.max(0, connectionConsumers - 1)

  if (connectionConsumers === 0) {
    socket.disconnect()
  }
}

export function emitTaskMoved(payload: TaskMovedPayload) {
  socket.emit('taskMoved', payload)
}
