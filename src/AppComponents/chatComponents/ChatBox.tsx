"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useFetchUsersAndFriends } from "@/hooks/useFetchUsersAndFriends"
import React, { useEffect, useRef, useState } from "react"
import ChatHeader from "./ChatHeader"
import axios from "axios"
import { Room } from "@/types/roomTypes"
import MessageList from "./MessageList"
import { ChatBoxProps, MessageType } from "./types"
import { Socket } from "socket.io-client"
import ChatInput from "./ChatInput"
import { io } from "socket.io-client"

let socket: Socket

export default function ChatBox({ roomName }: ChatBoxProps) {
  const { user } = useUserContext()
  const [messages, setMessages] = useState<MessageType[] | []>([])
  const [newMessage, setNewMessage] = useState("")
  const [joinedUsersData, setJoinedUsersData] = useState<any[] | []>([])
  const [mediaType, setMediaType] = useState("none")
  const [mediaUrl, setMediaUrl] = useState("")
  const [popoverClose, setPopOverClose] = useState(false)
  const myId = user?.uid

  const me = user?.personalInfo.username

  useEffect(() => {
    // Initialize Socket.IO connection to the server
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")

    // Listen for incoming messages via Socket.IO
    socket.on("chatMessage", (message: MessageType) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    // Load existing messages and room data
    if (user !== null) {
      async function loadMessages() {
        try {
          const responseForRoomData = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/rooms/get-room-by-name/${roomName}`
          )
          const roomData: Room = responseForRoomData.data.room
          const joinedUsersIds = roomData.usersJoined

          const joinedUsersData = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users/get-users-by-ids`,
            { userIds: joinedUsersIds }
          )

          setJoinedUsersData(joinedUsersData.data.users)

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/chats/get-messages/${roomName}`
          )
          const messages: MessageType[] = response.data.messages
          setMessages(messages)
        } catch (error) {
          console.error("Error loading messages:", error)
        }
      }
      loadMessages()
    }

    return () => {
      // Disconnect from Socket.IO when component unmounts
      socket.disconnect()
    }
  }, [user, roomName])

  const handleSendMediaMessage = async () => {
    if (user === null || (mediaType === "" && mediaUrl === "")) return

    const messageData: MessageType = {
      id: crypto.randomUUID(),
      message: newMessage,
      mediaUrl: mediaUrl,
      mediaType:
        mediaType === "image"
          ? "image"
          : mediaType === "video"
          ? "video"
          : "none",
      roomName,
      createdAt: new Date().toISOString(),
      uid: user.uid,
      type: "public"
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/send-message`,
        messageData
      )
      socket.emit("sendMessage", messageData) // Send message via socket.io
      setNewMessage("")
      setPopOverClose(false)
      setMediaType("none")
      setMediaUrl("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user === null) return

    if (!newMessage.trim()) return

    const messageData: MessageType = {
      id: crypto.randomUUID(),
      message: newMessage,
      mediaUrl: "",
      mediaType: "none",
      roomName,
      createdAt: new Date().toISOString(),
      uid: user.uid,
      type: "public"
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/send-message`,
        messageData
      )
      socket.emit("sendMessage", messageData) // Send message via socket.io
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  useEffect(() => {
    if (mediaUrl !== "" && mediaType !== "none") {
      handleSendMediaMessage()
    }
  }, [mediaUrl, mediaType])

  return (
    <div className="min-h-screen max-w-7xl w-full h-full p-4 mx-auto">
      <ChatHeader roomName={roomName} />
      <MessageList
        messages={messages}
        me={me as string}
        joinedUsersData={joinedUsersData}
      />
      <ChatInput
        handleSendMessage={handleSendMessage}
        setNewMessage={setNewMessage}
        newMessage={newMessage}
        setMediaType={setMediaType}
        setMediaUrl={setMediaUrl}
        setPopOverClose={setPopOverClose}
        popoverClose={popoverClose}
      />
    </div>
  )
}
