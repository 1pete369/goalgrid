import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const goalId = (await params).goalId

    if (!goalId) {
      return NextResponse.json({ message: "Missing goal ID" }, { status: 400 })
    }

    const response = await axios.get(
      `${process.env.API_URL}/goals/get-goal/${goalId}`
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
  try {
    const goalId = (await params).goalId
    const { goal } = await req.json()
    console.log("goal", goal)
    console.log("Id", goalId)

    if (!goalId) {
      return NextResponse.json({ message: "Missing Goal Id" }, { status: 400 })
    }

    const response = await axios.patch(
      `${process.env.API_URL}/goals/update-goal-status/${goal.id}`,
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
  try {
    const goalId = (await params).goalId
    const { linkedHabits } = await req.json()
    if (!goalId) {
      return NextResponse.json({ message: "Missing Goal Id" }, { status: 400 })
    }

    if (linkedHabits && linkedHabits.length > 0) {
      console.log("Deleting linked habits:", linkedHabits)
      // You can add logic to delete linked habits first
      const response= await axios.delete(`${process.env.API_URL}/habits/delete-linked-habits`, {
        data: { habitIds: linkedHabits }
      })

      console.log(response.data)
    }

    const response = await axios.delete(
      `${process.env.API_URL}/goals/delete-goal/${goalId}`
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
