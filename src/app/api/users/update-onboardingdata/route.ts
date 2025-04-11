// app/api/users/pop-friend-id/[requesterId]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise< { requesterId: string }> }) {
  const  requesterId = (await params).requesterId;
  const { _id, recipientId } = await req.json();

  try {
    // This is where you would update the user by removing the friend ID (pop the friend)
    const updateResponse = await axios.patch(
      `${process.env.API_URL}/users/pop-friend-id/${requesterId}`,
      {
        _id,
        recipientId,
      }
    );
    
    return NextResponse.json(updateResponse.data);
  } catch (error) {
    console.error("Error removing friend ID:", error);
    return NextResponse.json({ error: "Failed to update user friend list" }, { status: 500 });
  }
}
