import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")
  if (!uid) {
    return NextResponse.json({ message: "Missing Uid" }, { status: 400 })
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/get-notes/${uid}`
    )
    const notes = response.data.notes
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function POST(req: Request) {
  const { noteObj } = await req.json()

  if (!noteObj) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 })
  }
  try {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notes/create-note`,
        { noteObj }
      )

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
