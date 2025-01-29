export type Friend = {
  id: string
  requesterId: string
  recipientId: string
  status: "pending" | "accepted" | "rejected" | "blocked"
  createdAt: string
}

export type RecipientUser = {
  recipientId: string
  recipientName: string
  recipientUserName: string
  recipientPhotoURL: string
}