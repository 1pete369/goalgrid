import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { newCredentialUserObject } = await req.json();

    const response = await axios.post(
      `${process.env.API_URL}/credentials/create-credential-user`,
      { newCredentialUserObject }
    );

    return NextResponse.json({ user: response.data.user }, { status: 200 });
  } catch (error) {
    console.error("Error creating user credentials:", error);
    return NextResponse.json(
      { error: "Failed to create user credentials" },
      { status: 500 }
    );
  }
}
