import { NextResponse } from "next/server"
import axios from "axios"
// Handle PATCH request (update habit status)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  const habitId = (await params).habitId
  const { habit } = await req.json() // Parse the request body as JSON
  if (!habitId) {
    return NextResponse.json({ message: "Missing habit ID" }, { status: 400 })
  }

  console.log(habitId)

  try {
    const response = await axios.patch(
      `${process.env.API_URL}/habits/update-habit-status/${habitId}`,
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
  const habitId = (await params).habitId
  if (!habitId) {
    return NextResponse.json(
      { message: "Habit Id is missing" },
      { status: 400 }
    )
  }
  try {
    const response = await axios.delete(
      `${process.env.API_URL}/habits/delete-habit/${habitId}`
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
