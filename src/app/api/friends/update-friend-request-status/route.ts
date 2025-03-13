// app/api/friends/update-friend-request-status/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request) {
  const { requesterId, recipientId, status } = await req.json();

  try {
    const response = await axios.patch(
      `${process.env.API_URL}/friends/update-friend-request-status`,
      { requesterId, recipientId, status }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error updating friend request status:", error);
    return NextResponse.json({ error: "Failed to update friend request status" }, { status: 500 });
  }
}
