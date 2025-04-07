"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import io, { Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({ socket: null })

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL) // Establish connection

    return () => {
      socketRef.current?.disconnect() // Clean up on unmount
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
 