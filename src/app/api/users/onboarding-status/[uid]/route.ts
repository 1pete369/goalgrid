import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const uid= (await params).uid

  try {
    const response = await axios.get(
      `${process.env.API_URL}/users/onboarding-status/${uid}`
    )
    return NextResponse.json(response.data.flag)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    )
  }
}
