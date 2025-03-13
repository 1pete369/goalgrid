import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { friendRequestObject, userId } = await req.json();

    const response = await axios.post(
      `${process.env.API_URL}/friends/send-friend-request`,
      friendRequestObject
    );

    console.log(response.data.friendRequest._id)

    await axios.patch(
      `${process.env.API_URL}/users/push-friend-id/${userId}`,
      {
        _id: response.data.friendRequest._id,
        recipientId: friendRequestObject.recipientId
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to send friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
