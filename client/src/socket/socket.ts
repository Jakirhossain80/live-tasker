import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
})

export type TaskMovedPayload = {
  boardId: string
  taskId: string
  fromStatus: string
  toStatus: string
  order: number
}

export function emitTaskMoved(payload: TaskMovedPayload) {
  socket.emit('taskMoved', payload)
}
