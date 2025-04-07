import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const uid = (await params).uid
  if (!uid) {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 })
  }
  try {
    const response = (
      await axios.get(
        `${process.env.API_URL}/rewards/get-daily-rewards-status/${uid}`
      )
    ).data

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching rewards data:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { task, tokens } = await req.json()
  const uid = (await params).uid
  if (!uid || !task || typeof tokens !== "number") {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 })
  }
  try {
    const response = (
      await axios.post(`${process.env.API_URL}/rewards/claim`, {
        userId: uid,
        reward: task,
        tokens
      })
    ).data

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching rewards data:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
