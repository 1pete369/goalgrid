import React from "react"

export default function ChatHeader({ roomName }: { roomName: string }) {
  return (
    <header className="m-4 border-b-2 border-black/20">
      <h5 className="text-lg font-semibold">{roomName} Chat</h5>
    </header>
  )
}
