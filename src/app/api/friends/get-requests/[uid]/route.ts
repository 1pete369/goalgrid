import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request,{params}:{params : Promise<{uid: string}>}) {
  try {
    const uid =(await params).uid

    const response = await axios.get(
        `${process.env.API_URL}/friends/get-requests/${uid}`
      )
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
  }
}
