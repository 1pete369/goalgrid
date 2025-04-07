import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import React, { SetStateAction } from "react"
import MediaUploadButton from "../MediaUploadButton"

type ChatInputPropsType = {
  handleSendMessage: (e: React.FormEvent) => Promise<void>
  setNewMessage: React.Dispatch<SetStateAction<string>>
  newMessage: string
  setMediaUrl: React.Dispatch<SetStateAction<string>>
  setMediaType: React.Dispatch<SetStateAction<string>>
  popoverClose: boolean
  setPopOverClose: React.Dispatch<SetStateAction<boolean>>
}

export default function ChatInput({
  handleSendMessage,
  setNewMessage,
  newMessage,
  setMediaType,
  setMediaUrl,
  setPopOverClose,
  popoverClose
}: ChatInputPropsType) {
  return (
    <div className="w-full">
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
          className="flex-1 md:max-w-md lg:max-lg rounded-sm px-3 py-1 placeholder:text-gray-800 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-100 focus:border-primary-800"
          placeholder="Enter message here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <Button
          type="submit"
          className="bg-cyan-500 text-white rounded-md shadow-sm hover:bg-cyan-600 focus:outline-none"
          disabled={newMessage.trim().length === 0}
        >
          <Send />
        </Button>
        <MediaUploadButton
          setMediaUrl={setMediaUrl}
          setMediaType={setMediaType}
          popoverClose={popoverClose}
          setPopOverClose={setPopOverClose}
        />
      </form>
    </div>
  )
}
