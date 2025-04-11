import { getSecureAxios } from "@/lib/secureAxios"
import axios from "axios"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET(
  req: Request
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const response = (
      await axiosInstance.get(
        `/rewards/get-daily-rewards-status/${session.user.id}`
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
  req: Request
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const { task, tokens } = await req.json()
  
  if (!task || typeof tokens !== "number") {
    return NextResponse.json({ message: "Missing data" }, { status: 400 })
  }
  try {
    const response = (
      await axiosInstance.post(`/rewards/claim`, {
        userId: session.user.id,
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
