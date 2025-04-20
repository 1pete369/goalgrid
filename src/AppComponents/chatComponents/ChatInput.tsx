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
    <div className="w-full h-12">
      <form className="flex items-center" onSubmit={handleSendMessage}>
        <Label htmlFor="messageBox" className="hidden">
          Message
        </Label>
        <Input
          id="messageBox"
          type="text"
          className="w-full h-12 px-3 py-4 placeholder:text-gray-800 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-100 border-r-2 border-r-black outline-none ring-0 focus:outline-none focus:ring-0  rounded-none shadow-none focus-visible:ring-0"
          placeholder="Enter message here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />

        <Button
          type="submit"
          className="h-12 px-4 py-4  border-r-2 border-r-black bg-secondary-500 text-white rounded-none shadow-sm hover:bg-cyan-600 focus:outline-none"
          disabled={newMessage.trim().length === 0}
        >
          <Send size={20}/>
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
