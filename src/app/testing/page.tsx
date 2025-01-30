"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import axios from "axios"
import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

let socket: Socket

const Home = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const { user } = useUserContext()

  useEffect(() => {
    // Connect to the server when the component mounts
    socket = io("https://goal-grid-render.onrender.com") // Make sure this matches your server URL

    // Listen for incoming chat messages
    socket.on("chatMessage", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    async function loadMessages() {
        const roomName = "redis-check"
        const response= await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats/get-messages/${roomName}`)
        const messagesFetched= response.data.data
        setMessages(messagesFetched)
    }
    loadMessages()

    // Cleanup when the component is unmounted
    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (message.trim()) {
      const socket = io("https://goal-grid-render.onrender.com")

      const messageData={
        message,
        uid: user?.uid, // User ID
        roomName: "redis-check", // Room Name (if applicable)
        type: "public", // "public" or "private"
        mediaUrl: "", // Media URL (optional)
        mediaType: "none" // Media Type (image, video, none)
      }

      socket.emit("sendMessage",messageData)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Real-time Chat App</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Messages</h2>
          <div className="max-h-60 overflow-y-auto mt-2">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 my-2 bg-gray-200 rounded-lg">
                {msg.message}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
