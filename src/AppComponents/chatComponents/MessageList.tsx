import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { format, parseISO } from "date-fns"
import { Maximize } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useRef } from "react"
import { MessageType, UserData } from "./types"
import MessagesSkeleton from "@/skeletons/MessagesSkeleton"

type MessageListPropsType = {
  messagesLoading: boolean
  messages: MessageType[]
  joinedUsersData: any
  me: string
}

export default function MessageList({
  messages,
  joinedUsersData,
  me,
  messagesLoading
}: MessageListPropsType) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="m-4 mx-auto w-full bg-white dark:bg-transparent flex flex-col overflow-y-auto h-[80vh] p-4 space-y-4 rounded-md">
      {messagesLoading === true ? (
        <MessagesSkeleton />
      ) : (
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((message, index) => {
          const user: UserData = joinedUsersData.find(
            (user: any) => message.uid === user.uid
        )
          return (
            <div
              className={`flex items-start space-x-2 ${
                me === user?.personalInfo?.username &&
                "self-end flex-row-reverse"
              }`}
              key={message.id || index}
            >
              <Image
                src={user?.personalInfo?.photoURL || "/google.png"}
                height={22}
                width={22}
                alt="User"
                className={`object-contain mt-2 ${
                  me === user?.personalInfo?.username ? "ml-1" : "mr-1"
                } rounded-full`}
              />
              <div
                className={`flex flex-col shadow-sm rounded-md p-2 border border-gray-300 ${
                  me === user?.personalInfo?.username
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <div
                  className={`flex items-center justify-between mr-2 text-xs gap-2 ${
                    me === user?.personalInfo?.username
                      ? "justify-end"
                      : "text-gray-700 dark:text-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h6
                      className={`font-semibold leading-5 text-sm ${
                        me === user?.personalInfo?.username
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {me === user?.personalInfo?.username
                        ? "you"
                        : user?.personalInfo?.name}
                    </h6>
                    <p className="font-semibold leading-5 text-gray-500 dark:text-gray-400">
                      {message.createdAt
                        ? format(parseISO(message.createdAt), "hh:mm a")
                        : "Loading date..."}
                    </p>
                  </div>
                  <div>
                    {message.mediaType !== "none" && (
                      <Dialog>
                        <DialogTrigger className="">
                          <Maximize size={16} className="" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="sr-only">
                              Media popup
                            </DialogTitle>
                            {message.mediaType === "image" ? (
                              <Image
                                src={message.mediaUrl as string}
                                height={200}
                                width={200}
                                quality={100}
                                alt={message.mediaType}
                                className="w-auto mt-1 rounded"
                              />
                            ) : (
                              <video
                                src={message.mediaUrl}
                                height={200}
                                width={200}
                                className="w-auto h-[200px] rounded"
                                muted
                                autoPlay
                                loop
                                controls
                              />
                            )}
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                {message.mediaType === "none" || !message.mediaUrl ? (
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {message.message}
                  </p>
                ) : message.mediaType === "image" ? (
                  <Image
                    src={message.mediaUrl as string}
                    height={200}
                    width={200}
                    quality={100}
                    alt={message.mediaType}
                    className="w-auto mt-1"
                  />
                ) : (
                  <video
                    src={message.mediaUrl}
                    height={200}
                    width={200}
                    className="w-auto h-[200px]"
                    muted
                    autoPlay
                    loop
                    controls
                  />
                )}
              </div>
            </div>
          )
        })
      )}
      <div ref={chatEndRef} />
    </div>
  )
}
