import { Button } from "@/components/ui/button"
import axios from "axios"
import { SetStateAction } from "react"
import { io } from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_API_URL as string)


export default function PublicJournalsLandingpage({
  uid,
  roomName,
  setIsJoined
}: {
  uid: string
  roomName: string
  setIsJoined: React.Dispatch<SetStateAction<boolean>>
}) {
  const handleJoinRoom = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/join-the-user`,
        { id: uid, roomName }
      )

      if (response.data.flag) {
        setIsJoined(true)
        socket.emit("userJoined", { roomName, userId: uid }) // Notify others
      } // Updates state based on API response
    } catch (error) {
      console.error("Error joining the room:", error)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-600 py-12 px-6 sm:px-8 text-white">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center">
        Join the Public Journals Room
      </h1>
      <div className="text-lg md:text-xl mb-8 max-w-3xl text-center">
        <p className="mt-4">
          Reflect, share your thoughts, and inspire others. Public Journals are
          a space for self-expression and community connection.
        </p>
        <p className="mt-4">
          Join the conversation, share your journey, and motivate others along
          the way.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleJoinRoom}
          className="w-[200px] text-lg font-semibold py-4 px-6 rounded-full bg-yellow-600 hover:bg-yellow-700 transition duration-300 ease-in-out"
        >
          Join the Room
        </Button>
      </div>
    </div>
  )
}
