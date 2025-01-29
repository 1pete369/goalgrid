import { Button } from "@/components/ui/button"
import axios from "axios"
import { SetStateAction } from "react"

export default function CommunityFeedbackLandingpage({
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-6 sm:px-8 ">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center">
        Join the Community Feedback Room
      </h1>
      <div className="text-lg md:text-xl mb-8 max-w-3xl text-center">
        <p className="mt-4">
          Share your thoughts, ideas, and feedback to help shape the community.
          We value your input and want to hear from you!
        </p>
        <p className="mt-4">
          Join other like-minded individuals to discuss improvements, growth,
          and more.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleJoinRoom}
          className="w-[200px] text-lg font-semibold py-4 px-6 rounded-full bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out"
        >
          Join the Room
        </Button>
      </div>
    </div>
  )
}
