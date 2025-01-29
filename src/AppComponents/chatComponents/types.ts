export type ChatBoxProps = {
  roomName: string
}

export type UserData = {
  personalInfo: {
    name: string
    username: string
    photoURL: string
  }
}

export type MessageType = {
  id: string
  uid: string
  message?: string
  mediaUrl?: string
  mediaType?: "image" | "video" | "none"
  createdAt: string
  roomName: string
  type: "public" | "private"
}
