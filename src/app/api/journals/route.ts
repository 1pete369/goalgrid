import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getSecureAxios } from "@/lib/secureAxios"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const response = await axiosInstance.get(
      `/journals/get-journals/${session.user.id}`
    )
    console.log("response", response.data)

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
  
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const { journalObj } = await req.json()

  if (!journalObj) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 })
  }
  try {
    const response = await axiosInstance.post(
      `/journals/create-journal`,
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
