// app/api/habits/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

// Handle GET request (fetch habits by user ID)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const response = await axiosInstance.get(
      `/habits/get-habits/${session.user.id}`
    )
    const habits = response.data.data
    console.log("Habits Data:", response.data)
    return NextResponse.json(habits)
  } catch (error) {
    console.error("Error fetching habits:", error)
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
  const { habit } = await req.json() // Parse the request body as JSON
  console.log(habit)

  try {
    // Step 1: Create the habit in the database
    const response = await axiosInstance.post(
      `/habits/create-habit`,
      { habit: habit }
    )
    console.log("Created Habit:", response.data)

    const habitCreated = response.data.data
    const habitIdInDb = habitCreated._id // Get the habit's ID from the response
    const linkedGoalId = habit.linkedGoal // Get the linked goal ID from the incoming habit

    // Step 2: Link the habit to the goal if a linkedGoal exists
    if (linkedGoalId) {
      console.log("Linking habit to goal:", linkedGoalId)

      // Send PATCH request to update the goal with the new habit ID
      const response2 = await axiosInstance.patch(
        `/goals/link-habit/${session.user.id}`,
        { habitIdInDb, linkedGoalId }
      )
      console.log(response2.data)
      
      console.log("Goal updated with new habit:", response2.data)
    }

    // Return the habit creation response to the client
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error creating habit:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
