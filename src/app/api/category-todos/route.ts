// app/api/category-todos/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function POST(req: Request) {

  const session = await getServerSession(authOptions) // ✅ Fetch once
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    // Parse the request body to extract the necessary data
    const { todo, categoryId } = await req.json()

    // Make a request to create the todo
    const response = (
      await axiosInstance.post(`/todos/create-todo`, {
        todo
      })
    ).data
    console.log(response)

    // Extract the new Todo object ID
    const todoObjectId = response.newTodoObject._id
    console.log("TodoObjectId", todoObjectId)

    // Update the category with the new Todo ID
    const response2 = await axiosInstance.patch(
      `/categories/push-todo-id/${session.user.id}`,
      { todoObjectId, categoryId }
    )
    console.log(response2)

    return NextResponse.json(
      { message: "Todo created and added to category successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to create and add todo" },
      { status: 500 }
    )
  }
}

