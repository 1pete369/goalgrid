import { NextResponse } from "next/server"
import axios from "axios"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ journalId: string }> }
) {
  try {
    const journalId = (await params).journalId
    const { journalObj } = await req.json()
    if (!journalId) {
      return NextResponse.json({ message: "Missing journal id" }, { status: 400 })
    }
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/update-journal/${journalObj.id}`,
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

export async function DELETE(req: Request,{
  params
}: {
  params: Promise<{ journalId: string }>
}) {
  try {
    const journalId = (await params).journalId
    if (!journalId) {
      return NextResponse.json({ message: "Missing journal id" }, { status: 400 })
    }
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/delete-journal/${journalId}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function GET(req: Request,{ params }: { params: Promise<{ journalId: string }> }) {
  console.log("Get journal called in server")

  try {
    const journalId = (await params).journalId
    console.log("journalId", journalId)
    if (!journalId) {
      return NextResponse.json({ message: "Missing journal id" }, { status: 400 })
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/get-journal/${journalId}`
    )
    console.log("journal", response.data.journal)
    return NextResponse.json(response.data.journal)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
