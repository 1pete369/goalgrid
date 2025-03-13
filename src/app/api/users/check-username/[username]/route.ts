import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const username = (await params).username

  try {
    const response = await axios.get(
      `${process.env.API_URL}/users/check-username/${username}`
    )
    return NextResponse.json(response.data.exist)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch username data" },
      { status: 500 }
    )
  }
}
