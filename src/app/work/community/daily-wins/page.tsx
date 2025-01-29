import { getAuthenticatedUser } from "@/AppComponents/SessionUser"
import axios from "axios"
import DailyWinsClient from "./DailyWinsClient"

export default async function CommunityFeedbackPage() {
  const user = await getAuthenticatedUser()
  const roomName = "daily-wins"

  if (!user) return <p>Loading...</p> // Handle unauthenticated users

  let isUserJoined = false

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms/is-user-joined`,
      { params: { id: user.id, roomName } }
    )
    isUserJoined = response.data.isUserJoined
  } catch (error) {
    console.error("Error fetching room data:", error)
  }

  return (
    <DailyWinsClient
      userId={user.id}
      roomName={roomName}
      initialIsJoined={isUserJoined}
    />
  )
}
