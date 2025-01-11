"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import axios from "axios"
import Pusher from "pusher-js"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import Image from "next/image"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { format, parseISO } from "date-fns"

type MessageType = {
  id: string
  uid: string
  message: string
  username: string
  name: string
  userProfileImage: string
  createdAt: string
  roomName: string
  type: "public" | "private"
}

export default function ChatBox() {
  const { user } = useUserContext()
  const [messages, setMessages] = useState<MessageType[] | []>([])
  const [newMessage, setNewMessage] = useState("")
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Fetch initial messages
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/chat`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages :", error))

    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, []) // Empty dependency array to ensure this runs only once on mount

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  
    if (pusherKey && pusherCluster) {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });
  
      const channel = pusher.subscribe("chat-room");
  
      channel.bind("new-message", (data: MessageType) => {
        setMessages((prevMessages) => {
          // Check for duplicate messages
          if (!prevMessages.find((msg) => msg.id === data.id)) {
            return [...prevMessages, data];
          }
          return prevMessages;
        });
      });
  
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    } else {
      console.error("Pusher environment variables are missing!");
    }
  }, []);
  

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
  
    if (user !== null) {
      if (newMessage.trim()) {
        const messageData: MessageType = {
          username: user?.personalInfo.username,
          message: newMessage,
          name: user.personalInfo.name,
          id: crypto.randomUUID(),
          uid: user.uid,
          createdAt: new Date().toISOString(),
          type: "public",
          roomName: "beginnersChat",
          userProfileImage: user.personalInfo.photoURL,
        };
  
        // Optimistically update the messages state
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage("");
  
        try {
          // Send the message to the server
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-message`, messageData);
        } catch (error) {
          console.error("Error sending message:", error);
          // Optional: Remove the optimistically added message on error
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageData.id)
          );
        }
      }
    }
  };
  

  if (user === null)
    return (
      <div className="h-screen w-full flex justify-center items-center animate-pulse">
        <p className="">Loading...</p>
      </div>
    )

  return (
    <div className="min-h-screen max-w-7xl w-full h-full p-4 mx-auto">
      <header className="m-4 border-b-2 border-black/20">
        <h5 className="text-lg font-semibold">Beginners Chat</h5>
      </header>
      <div className="m-4 mx-auto w-full bg-gray-100 flex flex-col overflow-y-auto h-[80vh] p-4 space-y-4 rounded-md">
        {Array.isArray(messages) &&
          messages.length > 0 &&
          messages.map((message,i) => {
            return (
              <div
                className={`flex items-start space-x-2 ${
                  user?.personalInfo.username === message.username &&
                  "self-end flex-row-reverse"
                }`}
                key={i}
              >
                <Image
                  src={message.userProfileImage || "/google.png"} // Fallback image
                  height={22}
                  width={22}
                  alt="User"
                  className={`object-contain mt-2 ${
                    message.username === user?.personalInfo.username
                      ? "ml-1"
                      : "mr-1"
                  } rounded-full`}
                />
                <div
                  className={`flex flex-col shadow-sm rounded-lg p-2 ${
                    user?.personalInfo.username === message.username
                      ? "border-gray-300 border bg-white"
                      : "border-gray-300 border bg-white"
                  }`}
                >
                  <div
                    className={`flex items-center text-xs gap-2 ${
                      user?.personalInfo.username === message.username
                        ? "text-primary-800"
                        : "text-gray-700"
                    } `}
                  >
                    <h6 className="font-semibold leading-5 text-sm">
                      {user?.personalInfo.username === message.username
                        ? "you"
                        : message.name}
                    </h6>
                    <p className="font-semibold leading-5">
                      {message.createdAt
                        ? format(parseISO(message.createdAt), "hh:mm a")
                        : "Loading date..."}
                    </p>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            )
          })}
        <div ref={chatEndRef} />
      </div>
      <div className="w-full ">
        <form
          className="flex items-center gap-2 lg:justify-center"
          onSubmit={handleSendMessage}
        >
          <Label htmlFor="messageBox" className="hidden">
            Message
          </Label>
          <Input
            id="messageBox"
            type="text"
            className="flex-1 md:max-w-md lg:max-lg rounded-sm px-3 py-1 placeholder:text-gray-800 text-gray-800 
         focus:border-primary-800"
            placeholder="Enter message here..."
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <Button
            type="submit"
            className=" bg-cyan-500 text-white rounded-md shadow-sm hover:bg-cyan-600 focus:outline-none"
            disabled={newMessage.trim().length === 0}
          >
            <Send />
          </Button>
        </form>
      </div>
    </div>
  )
}
