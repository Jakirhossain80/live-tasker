import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'

export type OnlineUser = {
  id: string
  name: string
  email: string
  avatar?: string
}

type OnlineUsersPayload = {
  workspaceId: string
  users: OnlineUser[]
}

type UserOnlinePayload = {
  workspaceId: string
  user: OnlineUser
}

type UserOfflinePayload = {
  workspaceId: string
  userId: string
}

function upsertOnlineUser(users: OnlineUser[], nextUser: OnlineUser) {
  if (users.some((user) => user.id === nextUser.id)) {
    return users.map((user) => (user.id === nextUser.id ? nextUser : user))
  }

  return [...users, nextUser]
}

export function useOnlineUsers(workspaceId?: string) {
  const { socket } = useSocket()
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    if (!workspaceId) {
      setOnlineUsers([])
      return
    }

    function handleOnlineUsers(payload: OnlineUsersPayload) {
      if (payload.workspaceId === workspaceId) {
        setOnlineUsers(payload.users)
      }
    }

    function handlePresenceUpdated(payload: OnlineUsersPayload) {
      if (payload.workspaceId === workspaceId) {
        setOnlineUsers(payload.users)
      }
    }

    function handleUserOnline(payload: UserOnlinePayload) {
      if (payload.workspaceId === workspaceId) {
        setOnlineUsers((currentUsers) => upsertOnlineUser(currentUsers, payload.user))
      }
    }

    function handleUserOffline(payload: UserOfflinePayload) {
      if (payload.workspaceId === workspaceId) {
        setOnlineUsers((currentUsers) => currentUsers.filter((user) => user.id !== payload.userId))
      }
    }

    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('presenceUpdated', handlePresenceUpdated)
    socket.on('userOnline', handleUserOnline)
    socket.on('userOffline', handleUserOffline)

    return () => {
      socket.off('onlineUsers', handleOnlineUsers)
      socket.off('presenceUpdated', handlePresenceUpdated)
      socket.off('userOnline', handleUserOnline)
      socket.off('userOffline', handleUserOffline)
    }
  }, [socket, workspaceId])

  return onlineUsers
}
