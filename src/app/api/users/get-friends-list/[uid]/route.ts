import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params:Promise< { uid: string }> }) {
  const uid  = (await params).uid;

  try {
    const response = await axios.get(`${process.env.API_URL}/users/get-friends-list/${uid}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching friend list:", error);
    return NextResponse.json({ error: "Failed to fetch friends list" }, { status: 500 });
  }
}
