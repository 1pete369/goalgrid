import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise< { uid: string }> }) {
  const uid =(await params).uid

  try {
    const response = await axios.patch(`${process.env.API_URL}/users/updateLastLogin/${uid}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update last login" }, { status: 500 });
  }
}
