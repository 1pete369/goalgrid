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
  messagesLoading,
}: MessageListPropsType) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div
      className="px-2 pt-4 w-full h-[80vh] overflow-y-auto space-y-3"
    >
      {messagesLoading ? (
        <MessagesSkeleton />
      ) : (
        messages.map((message, index) => {
          const user: UserData = joinedUsersData.find(
            (u: any) => u.uid === message.uid
          )
          const isMe = me === user?.personalInfo?.username

          return (
            <div
              key={message.id || index}
              className={`flex items-end gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Image
                  src={user?.personalInfo?.photoURL || "/google.png"}
                  height={28}
                  width={28}
                  alt="User"
                  className="rounded-full mt-1"
                />
              )}

              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-primary-500 dark:bg-primary-800 text-white rounded-br-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-black dark:text-white rounded-bl-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-xs mb-2 opacity-80">
                  <span>{isMe ? "You" : user?.personalInfo?.name}</span>
                  <span>
                    {message.createdAt
                      ? format(parseISO(message.createdAt), "hh:mm a")
                      : ""}
                  </span>
                </div>

                {/* Media preview */}
                {message.mediaType !== "none" && message.mediaUrl && (
                  <div className="relative group mb-2">
                    <Dialog>
                      <DialogTrigger className="absolute top-1 right-1 z-10 p-1 bg-black/40 rounded hover:bg-black/60">
                        <Maximize size={16} className="text-white" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="flex-1 justify-center items-center">
                          <DialogTitle className="sr-only">
                            Media Preview
                          </DialogTitle>
                          {message.mediaType === "image" ? (
                            <Image
                              src={message.mediaUrl}
                              height={400}
                              width={400}
                              alt="Media"
                              className="rounded-lg"
                            />
                          ) : (
                            <video
                              src={message.mediaUrl}
                              controls
                              className="rounded-lg max-h-[400px] w-full"
                            />
                          )}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    {message.mediaType === "image" ? (
                      <Image
                        src={message.mediaUrl}
                        height={200}
                        width={200}
                        alt="Media"
                        className="rounded-md"
                      />
                    ) : (
                      <video
                        src={message.mediaUrl}
                        className="rounded-md max-h-[200px] w-auto"
                        autoPlay
                        loop
                        muted
                        controls
                      />
                    )}
                  </div>
                )}

                {/* Text Message */}
                {(message.mediaType === "none" || !message.mediaUrl) && (
                  <p className="whitespace-pre-wrap break-all leading-relaxed">
                    {message.message}
                  </p>
                )}
              </div>

              {isMe && (
                <Image
                  src={user?.personalInfo?.photoURL || "/google.png"}
                  height={28}
                  width={28}
                  alt="You"
                  className="rounded-full mt-1"
                />
              )}
            </div>
          )
        })
      )}
      <div ref={chatEndRef} />
    </div>
  )
}
