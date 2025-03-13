import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(req: Request, { params }: { params: Promise< { uid: string }> }) {
  const uid = (await params).uid
  const { username, name } = await req.json();

  const updateFields = { username, name };

  try {
    const response = await axios.patch(`${process.env.API_URL}/users/update-profile/${uid}`, updateFields);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
