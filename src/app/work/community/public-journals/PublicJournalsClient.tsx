"use client"

import ChatBox from "@/AppComponents/chatComponents/ChatBox"
import { useState } from "react"
import PublicJournalsLandingpage from "./PublicJournalsLandingpage"

export default function PublicJournalsClient({
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
    <div className="">
      {!isUserJoined ? (
        <PublicJournalsLandingpage
          uid={userId}
          roomName={roomName}
          setIsJoined={setIsUserJoined}
        />
      ) : (
        <ChatBox roomName={roomName} />
      )}
    </div>
  )
}
