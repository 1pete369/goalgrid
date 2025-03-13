import { NextResponse } from "next/server"
import axios from "axios"

// const API_URL = process.env.API_URL || "http://localhost:3001"


export async function PATCH(req:Request,{
  params
}: {
  params: Promise<{ taskId: string }>
}) {

    const taskId = (await params).taskId
    const {completedStatus} = await req.json()

    console.log("taskId",taskId)
    console.log("completedStatus",completedStatus)

    if(!taskId){
        return NextResponse.json({message : "TaskId is missing"},{status: 400})
    }

    try {
        const response= await axios.patch(`${process.env.API_URL}/today-tasks/toggle-task/${taskId}`,{completedStatus})
        return NextResponse.json(response.data.data)
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 504 }
      )
    }
}


export async function DELETE(req: Request,{params}:{params : Promise<{taskId: string}>}){
    const taskId = (await params).taskId
    if(!taskId){
        return NextResponse.json({message : "TaskId is missing"},{status: 400})
    }
    try {
        const response= await axios.delete(`${process.env.API_URL}/today-tasks/delete-task/${taskId}`)
        return NextResponse.json(response.data.data)
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 504 }
      )
    }
}