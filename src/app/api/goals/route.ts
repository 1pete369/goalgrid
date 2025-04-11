import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)
    // Fetch all goals for a user
    const response = await axiosInstance.get(`/goals/get-goals/${session.user.id}`)
    console.log("Fetched goals:", response.data)
    return NextResponse.json(response.data.goals)
  } catch (error) {
    console.error("Error Fetching goals:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const { goal } = await req.json()
  console.log(goal)
  try {
    const response = await axiosInstance.post(`/goals/create-goal`, { goal })
    console.log(response.data)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error Posting goals:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
