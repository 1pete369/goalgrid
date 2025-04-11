import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { getSecureAxios } from "@/lib/secureAxios"
import axios from "axios"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(
  req: Request
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session) 

  try {
    const response = await axiosInstance.get(
      `/goals/analytics/${session.user.id}`
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
