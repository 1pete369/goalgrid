// app/api/subscriptions/check-subscription-status/[uid]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise< { uid: string }> }) {
  const uid =(await params).uid;

  try {
    // Call the backend API to fetch the subscription status for the user
    const response = await axios.get(
      `${process.env.API_URL}/subscriptions/check-subscription-status/${uid}`
    );

    return NextResponse.json(response.data); // Send the response from the backend API back to the client
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 });
  }
}
