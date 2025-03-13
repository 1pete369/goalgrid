import { NextResponse } from "next/server"
import axios from "axios"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const noteId = (await params).noteId
    const { noteObj } = await req.json()
    if (!noteId) {
      return NextResponse.json({ message: "Missing note id" }, { status: 400 })
    }
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/update-note/${noteId}`,
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

export async function DELETE(req: Request,{
  params
}: {
  params: Promise<{ noteId: string }>
}) {
  try {
    const noteId = (await params).noteId
    if (!noteId) {
      return NextResponse.json({ message: "Missing note id" }, { status: 400 })
    }
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/delete-note/${noteId}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function GET(req: Request,{ params }: { params: Promise<{ noteId: string }> }) {
  console.log("Get note called in server")

  try {
    const noteId = (await params).noteId
    console.log("noteId", noteId)
    if (!noteId) {
      return NextResponse.json({ message: "Missing note id" }, { status: 400 })
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/get-note/${noteId}`
    )
    console.log("Note", response.data.note)
    return NextResponse.json(response.data.note)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
