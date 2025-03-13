// app/api/subscriptions/update-subscription-status/[uid]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise <{ uid: string }> }) {
  const uid =(await params).uid;
  const { plan, startDate, expiryDate, isActive, billingCycle, durationInMonths } = await req.json();

  try {
    // Call the backend API to update subscription details for the user
    const response = await axios.patch(
      `${process.env.API_URL}/subscriptions/update-subscription-status/${uid}`,
      {
        plan,
        startDate,
        expiryDate,
        isActive,
        billingCycle,
        durationInMonths
      }
    );

    return NextResponse.json(response.data); // Send back the response data to the client
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
  }
}
