import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"
// Handle PATCH request (update habit status)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const habitId = (await params).habitId
  const { habit } = await req.json() // Parse the request body as JSON
  if (!habitId) {
    return NextResponse.json({ message: "Missing habit ID" }, { status: 400 })
  }

  console.log(habitId)

  try {
    const response = await axiosInstance.patch(
      `/habits/update-habit-status/${habitId}`,
      { habit: habit }
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error updating habit:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const habitId = (await params).habitId
  if (!habitId) {
    return NextResponse.json(
      { message: "Habit Id is missing" },
      { status: 400 }
    )
  }
  try {
    const response = await axiosInstance.delete(
      `/habits/delete-habit/${habitId}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error deleting habit:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
