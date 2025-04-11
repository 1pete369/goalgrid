import { NextResponse } from "next/server"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET() {
  try {
     const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session) 

    const response = await axiosInstance.get(`/notes/get-notes/${session.user.id}`)
    const notes = response.data.notes

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    const status = (error as any)?.response?.status || 504
    return NextResponse.json({ message: "Internal server error" }, { status })
  }
}

export async function POST(req: Request) {
  try {
     const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session) 
    const { noteObj } = await req.json()

    if (!noteObj) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 })
    }

    const response = await axiosInstance.post("/notes/create-note", { noteObj })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error creating note:", error)
    const status = (error as any)?.response?.status || 504
    return NextResponse.json({ message: "Internal server error" }, { status })
  }
}