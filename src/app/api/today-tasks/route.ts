import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  const { task } = await req.json()
  if (!task) {
    return NextResponse.json({ message: "Task Missing" }, { status: 400 })
  }
  try {
    const response = await axios.post(
      `${process.env.API_URL}/today-tasks/create-task`,
      { task }
    )
    const data = response.data
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const uid= searchParams.get("uid")
    if(!uid){
        return NextResponse.json({message : "UserId missing"},{status: 400})
    }
  try {
    const response = await axios.get(`${process.env.API_URL}/today-tasks/get-tasks/${uid}`)
    const data= response.data.tasks
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
