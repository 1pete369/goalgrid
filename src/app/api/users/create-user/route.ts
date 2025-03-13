import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const {user} = await req.json();

  try {
    const userExistResponse = await axios.get(`${process.env.API_URL}/users/check-user/${user.uid}`);
    if (userExistResponse.data.exist) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const response = await axios.post(`${process.env.API_URL}/users/create-user`, { user });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
