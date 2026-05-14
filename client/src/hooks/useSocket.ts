import { useEffect, useState } from 'react'
import { connectSocket, disconnectSocket, socket } from '../socket/socket'
import { useAuthStore } from '../store/auth.store'

export function useSocket() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true)
    }

    function handleDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    setIsConnected(socket.connected)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      socket.disconnect()
      setIsConnected(false)
      return
    }

    connectSocket()

    return () => {
      disconnectSocket()
    }
  }, [accessToken, isAuthenticated])

  return {
    socket,
    isConnected,
  }
}

export default useSocket
