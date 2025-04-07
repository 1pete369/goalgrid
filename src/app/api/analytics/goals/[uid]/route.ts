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
  console.log(uid)
  try {
    const response = await axios.get(
      `${process.env.API_URL}/goals/analytics/${uid}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
