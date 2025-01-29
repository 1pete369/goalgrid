import { Button } from "@/components/ui/button"
import axios from "axios"
import { SetStateAction } from "react"

export default function DailyWinsLandingpage({
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
      setIsJoined(response.data.flag) // Updates state based on API response
    } catch (error) {
      console.error("Error joining the room:", error)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 py-12 px-6 sm:px-8 text-white">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center">
        Join the Daily Wins Room
      </h1>
      <div className="text-lg md:text-xl mb-8 max-w-3xl text-center">
        <p className="mt-4">
          Celebrate your daily victories, no matter how small. Share your wins
          and inspire others to keep pushing forward!
        </p>
        <p className="mt-4">
          Whether it's a personal or professional achievement, let’s celebrate
          progress together!
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleJoinRoom}
          className="w-[200px] text-lg font-semibold py-4 px-6 rounded-full bg-purple-600 hover:bg-purple-700 transition duration-300 ease-in-out"
        >
          Join the Room
        </Button>
      </div>
    </div>
  )
}
