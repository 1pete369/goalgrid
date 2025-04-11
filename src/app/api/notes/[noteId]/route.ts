import { NextResponse } from "next/server"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)
    const { noteObj } = await req.json()
    const noteId = (await params).noteId

    if (!noteId || !noteObj) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 })
    }

    const response = await axiosInstance.patch(`/notes/update-note/${noteId}`, {
      noteObj
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error updating note:", error)
    const status = (error as any)?.response?.status || 504
    return NextResponse.json({ message: "Internal server error" }, { status })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)
    const noteId = (await params).noteId

    if (!noteId) {
      return NextResponse.json({ message: "Missing note id" }, { status: 400 })
    }

    const response = await axiosInstance.delete(`/notes/delete-note/${noteId}`)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error deleting note:", error)
    const status = (error as any)?.response?.status || 504
    return NextResponse.json({ message: "Internal server error" }, { status })
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)
    const noteId = (await params).noteId

    if (!noteId) {
      return NextResponse.json({ message: "Missing note id" }, { status: 400 })
    }

    const response = await axiosInstance.get(`/notes/get-note/${noteId}`)
    return NextResponse.json(response.data.note)
  } catch (error) {
    console.error("Error fetching note:", error)
    const status = (error as any)?.response?.status || 504
    return NextResponse.json({ message: "Internal server error" }, { status })
  }
}
