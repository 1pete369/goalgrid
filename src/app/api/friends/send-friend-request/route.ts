import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const { friendRequestObject } = await req.json()

    console.log("friendRequestObject",friendRequestObject)

    const response = await axiosInstance.post(
      `/friends/send-friend-request`,
      friendRequestObject
    )

    console.log("response.data.friendRequest._id",response.data)

    await axiosInstance.patch(`/users/push-friend-id/${session.user.id}`, {
      _id: response.data.friendRequest._id,
      recipientId: friendRequestObject.recipientId
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Failed to send friend request:", error)
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    )
  }
}
