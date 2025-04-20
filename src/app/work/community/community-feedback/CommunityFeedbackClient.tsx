"use client"

import ChatBox from "@/AppComponents/chatComponents/ChatBox"
import CommunityFeedbackLandingpage from "./CommunityFeedbackLandingpage"
import { useState } from "react"

export default function CommunityFeedbackClient({
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
    <div className="min-h-screen px-4 pt-16">
      {!isUserJoined ? (
        <CommunityFeedbackLandingpage
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
