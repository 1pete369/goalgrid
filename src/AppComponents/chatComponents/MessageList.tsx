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

type MessageListPropsType = {
  messages: MessageType[]
  joinedUsersData: any
  me: string
}

export default function MessageList({
  messages,
  joinedUsersData,
  me
}: MessageListPropsType) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="m-4 mx-auto w-full bg-gray-100 flex flex-col overflow-y-auto h-[80vh] p-4 space-y-4 rounded-md">
      {Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((message) => {
          const user: UserData = joinedUsersData.find(
            (user: any) => message.uid === user.uid
          )
          return (
            <div
              className={`flex items-start space-x-2 ${
                me === user?.personalInfo?.username &&
                "self-end flex-row-reverse"
              }`}
              key={message.id}
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
                className={`flex flex-col shadow-sm rounded-lg p-2 ${
                  me === user?.personalInfo?.username
                    ? "border-gray-300 border bg-white"
                    : "border-gray-300 border bg-white"
                }`}
              >
                <div
                  className={`flex items-center justify-between mr-2 text-xs gap-2  ${
                    me === user?.personalInfo?.username
                      ? "text-primary-800 justify-end "
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h6 className="font-semibold leading-5 text-sm">
                      {me === user?.personalInfo?.username
                        ? "you"
                        : user?.personalInfo?.name}
                    </h6>
                    <p className="font-semibold leading-5">
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
                            <DialogTitle className=" sr-only">
                              Media popup
                            </DialogTitle>
                            {message.mediaType === "image" ? (
                              <Image
                                src={message.mediaUrl as string}
                                height={200}
                                width={200}
                                quality={100}
                                alt={message.mediaType}
                                className=" w-auto mt-1 rounded"
                              />
                            ) : (
                              <video
                                src={message.mediaUrl}
                                height={200}
                                width={200}
                                className=" w-auto h-[200px] rounded"
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
                {message.mediaType === "none" ? (
                  <p
                    className={`text-sm ${
                      me === user?.personalInfo?.username && "text-en"
                    }`}
                  >
                    {message.message}
                  </p>
                ) : message.mediaType === "image" ? (
                  <Image
                    src={message.mediaUrl as string}
                    height={200}
                    width={200}
                    quality={100}
                    alt={message.mediaType}
                    className=" w-auto mt-1"
                  />
                ) : (
                  <video
                    src={message.mediaUrl}
                    height={200}
                    width={200}
                    className=" w-auto h-[200px]"
                    muted
                    autoPlay
                    loop
                    controls
                  />
                )}
              </div>
            </div>
          )
        })}
      <div ref={chatEndRef} />
    </div>
  )
}
