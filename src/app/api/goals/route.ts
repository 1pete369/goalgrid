import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const uid = searchParams.get("uid") // for getting all goals

  console.log(" uid in server", uid)

  try {
    if (uid) {
      // Fetch all goals for a user
      const response = await axios.get(
        `${process.env.API_URL}/goals/get-goals/${uid}`
      )
      console.log("Fetched goals:", response.data)
      return NextResponse.json(response.data.goals)
    }
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 })
  } catch (error) {
    console.error("Error Fetching goals:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const { goal } = await req.json()
  console.log(goal)
  try {
    const response = await axios.post(
      `${process.env.API_URL}/goals/create-goal`,
      { goal }
    )
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
