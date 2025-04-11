import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const goalId = (await params).goalId

    if (!goalId) {
      return NextResponse.json({ message: "Missing goal ID" }, { status: 400 })
    }

    const response = await axiosInstance.get(
      `/goals/get-goal/${goalId}`
    )
    console.log("Fetched single goal:", response.data)

    return NextResponse.json(response.data.goal)
  } catch (error) {
    console.error("Error Fetching goal:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const goalId = (await params).goalId
    const { goal } = await req.json()
    console.log("goal", goal)
    console.log("Id", goalId)

    if (!goalId) {
      return NextResponse.json({ message: "Missing Goal Id" }, { status: 400 })
    }

    const response = await axiosInstance.patch(
      `/goals/update-goal-status/${goal.id}`,
      { goal }
    )
    console.log(response.data)
    const updatedGoal = response.data.updatedGoal
    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error Updating goal:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {

  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const goalId = (await params).goalId
    const { linkedHabits } = await req.json()
    if (!goalId) {
      return NextResponse.json({ message: "Missing Goal Id" }, { status: 400 })
    }

    if (linkedHabits && linkedHabits.length > 0) {
      console.log("Deleting linked habits:", linkedHabits)
      // You can add logic to delete linked habits first
      const response= await axiosInstance.delete(`/habits/delete-linked-habits`, {
        data: { habitIds: linkedHabits }
      })

      console.log(response.data)
    }

    const response = await axiosInstance.delete(
      `/goals/delete-goal/${goalId}`
    )
    console.log(response)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error Deleting goal:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
