// app/api/friends/delete-friend-request/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(req: Request) {
  const { recipientId, requesterId } = await req.json();
  
  try {
    const response = await axios.delete(
      `${process.env.API_URL}/friends/delete-friend-request`,
      { data: { recipientId, requesterId } }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error deleting friend request:", error);
    return NextResponse.json({ error: "Failed to delete friend request" }, { status: 500 });
  }
}
