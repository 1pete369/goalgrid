"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useFetchUsersAndFriends } from "@/hooks/useFetchUsersAndFriends"
import React, { useEffect, useState, useRef } from "react"
import ChatHeader from "./ChatHeader"
import axios from "axios"
import { Room } from "@/types/roomTypes"
import MessageList from "./MessageList"
import { ChatBoxProps, MessageType } from "./types"
import ChatInput from "./ChatInput"
import io, { Socket } from "socket.io-client"

export default function ChatBox({ roomName }: ChatBoxProps) {
  const { user } = useUserContext()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [joinedUsersData, setJoinedUsersData] = useState<any[]>([])
  const [mediaType, setMediaType] = useState("none")
  const [mediaUrl, setMediaUrl] = useState("")
  const [popoverClose, setPopOverClose] = useState(false)
  const myId = user?.uid

  const me = user?.personalInfo.username

  const socketRef = useRef<Socket | null>(null) // Using a ref to store the socket instance

  useEffect(() => {
    if (!user || !roomName) return;
  
    // Initialize socket only once when the component mounts
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL); // Single connection
  
    // Emit event to join the specific room
    socketRef.current.emit('joinRoom', roomName);
  
    // Listen for incoming chat messages
    socketRef.current.on("chatMessage", (message: any) => {
      setMessages((prevMessages) => [...(prevMessages || []), message]);
    });
  
    return () => {
      // Disconnect from the socket when component unmounts
      socketRef.current?.disconnect();
    };
  }, [user, roomName]);
  // Empty dependency array means this runs only once

  useEffect(() => {
    if (!user) return

    // Load existing messages and room data
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
        const messagesFetched: any[] = response.data.data
        setMessages(messagesFetched)
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadMessages()
  }, [user, roomName])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user === null || !newMessage.trim()) return

    const messageData: any = {
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
      // Check if socket is initialized and emit the message
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", messageData)
      }
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleSendMediaMessage = async () => {
    if (user === null || (mediaType === "" && mediaUrl === "")) return

    try {
      const messageData: any = {
        id: crypto.randomUUID(),
        message: newMessage,
        mediaUrl: mediaUrl,
        mediaType: mediaType === "image" ? "image" : mediaType === "video" ? "video" : "none",
        roomName,
        createdAt: new Date().toISOString(),
        uid: user.uid,
        type: "public"
      }
      // Check if socket is initialized and emit media message
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", messageData)
      }
      setNewMessage("")
      setPopOverClose(false)
      setMediaType("none")
      setMediaUrl("")
    } catch (error) {
      console.error("Error sending media message:", error)
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
