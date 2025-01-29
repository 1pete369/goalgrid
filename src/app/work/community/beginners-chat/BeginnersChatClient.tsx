"use client"

import { useState } from "react"
import BeginnersChatLandingpage from "./BeginnersChatLandinpage"
import ChatBox from "@/AppComponents/chatComponents/ChatBox"

export default function BeginnersChatClient({
  userId,
  roomName,
  initialIsJoined
}: {
  userId: string
  roomName: string
  initialIsJoined: boolean
}) {
  const [isUserJoined, setIsUserJoined] = useState(initialIsJoined)

  return (
    <>
      {!isUserJoined ? (
        <BeginnersChatLandingpage
          uid={userId}
          roomName={roomName}
          setIsJoined={setIsUserJoined}
        />
      ) : (
        <ChatBox roomName={roomName} />
      )}
    </>
  )
}
