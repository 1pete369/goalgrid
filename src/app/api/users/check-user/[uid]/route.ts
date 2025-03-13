import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ uid: string }>}) {
  const uid  = (await params).uid;

  try {
    const response = await axios.get(`${process.env.API_URL}/users/check-user/${uid}`);
    return NextResponse.json(response.data.exist);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
