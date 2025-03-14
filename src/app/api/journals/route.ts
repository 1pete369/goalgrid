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
      `${process.env.API_URL}/journals/get-journals/${uid}`
    )
    console.log("response",response.data)

    const journals = response.data.journals
    return NextResponse.json(journals)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function POST(req: Request) {
  const { journalObj } = await req.json()

  if (!journalObj) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 })
  }
  try {
    const response = await axios.post(
      `${process.env.API_URL}/journals/create-journal`,
      { journalObj }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
