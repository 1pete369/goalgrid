import React from "react"

export default function ChatHeader({ roomName }: { roomName: string }) {
  return (
    <header className="ml-2 mb-1">
      <h5 className="text-lg font-semibold">{roomName} Chat</h5>
    </header>
  )
}
