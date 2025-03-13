// app/api/habits/route.ts
import { NextResponse } from "next/server"
import axios from "axios"

// Handle GET request (fetch habits by user ID)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid") // Retrieve the query parameter 'uid'

  if (!uid) {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 })
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL}/habits/get-habits/${uid}`
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
  const { habit } = await req.json() // Parse the request body as JSON
  console.log(habit)

  try {
    // Step 1: Create the habit in the database
    const response = await axios.post(
      `${process.env.API_URL}/habits/create-habit`,
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
      const response2 = await axios.patch(
        `${process.env.API_URL}/goals/link-habit/${habit.uid}`,
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
