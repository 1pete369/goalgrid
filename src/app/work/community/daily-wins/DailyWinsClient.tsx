"use client"

import ChatBox from "@/AppComponents/chatComponents/ChatBox"
import DailyWinsLandingpage from "./DailyWinsLandingpage"
import { useState } from "react"

export default function DailyWinsClient({
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
        <DailyWinsLandingpage
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
