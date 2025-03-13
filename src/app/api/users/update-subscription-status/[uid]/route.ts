// app/api/users/update-subscription-status/[uid]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise< { uid: string }> }) {
  const uid =(await params).uid;
  const { plan } = await req.json();

  try {
    // Call the backend API that updates the subscription plan of the user
    const response = await axios.patch(
      `${process.env.API_URL}/users/update-subscription-status/${uid}`,
      { plan }
    );

    return NextResponse.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
  }
}
