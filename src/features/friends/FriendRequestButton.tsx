"use client"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { Friend } from "@/types/friendsTypes"

interface FriendRequestButtonProps {
  recipientUserId: string
  myUserId: string
  friendStatus: "pending" | "accepted" | "rejected" | "blocked" | null
  refreshFriendList: () => Promise<void>
}

export default function FriendRequestButton({
  recipientUserId,
  myUserId,
  friendStatus,
  refreshFriendList
}: FriendRequestButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleAddFriendRequest = async () => {
    setLoading(true)
    try {
      const friendRequestObject: Friend = {
        id: crypto.randomUUID(),
        recipientId: recipientUserId,
        requesterId: myUserId,
        createdAt: new Date().toISOString(),
        status: "pending"
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/send-friend-request`,
        friendRequestObject
      )
      console.log(response.data.friendRequest._id)

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/push-friend-id/${myUserId}`,
        { _id: response.data.friendRequest._id, recipientId: recipientUserId }
      )

      // Refresh friend list
      await refreshFriendList()
    } catch (error) {
      console.error("Error sending friend request:", error)
    } finally {
      setLoading(false)
    }
  }

  let buttonContent: React.ReactNode
  let buttonClass = ""
  let isDisabled = false

  switch (friendStatus) {
    case "pending":
      buttonContent = "Request Pending"
      buttonClass = "bg-yellow-500 hover:bg-yellow-400"
      isDisabled = true
      break
    case "accepted":
      buttonContent = "Friends"
      buttonClass = "bg-green-600 hover:bg-green-500"
      isDisabled = true
      break
    case "rejected":
      buttonContent = "Request Rejected"
      buttonClass = "bg-red-500 hover:bg-red-400"
      isDisabled = true
      break
    case "blocked":
      buttonContent = "Blocked"
      buttonClass = "bg-gray-500"
      isDisabled = true
      break
    default:
      buttonContent = loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          Add Friend <Plus />
        </>
      )
      buttonClass = "bg-blue-600 hover:bg-blue-500"
      break
  }

  return (
    <Button
      disabled={isDisabled || loading}
      className={`${buttonClass} shadow-md`}
      onClick={handleAddFriendRequest}
    >
      {buttonContent}
    </Button>
  )
}
