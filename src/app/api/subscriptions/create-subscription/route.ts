// app/api/subscriptions/create-subscription/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { subscriptionObject } = await req.json();
    
    // Create the subscription in the backend
    const response = await axios.post(
      `${process.env.API_URL}/subscriptions/create-subscription`,
      { subscriptionObject }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
