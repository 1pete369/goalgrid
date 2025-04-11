import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  
    const session = await getServerSession(authOptions) // ✅ Fetch once
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
  
    const { axiosInstance } = await getSecureAxios(session)

  try {
    const { categoryId, status } = await req.json()
    const todoId = (await params).todoId

    const response = await axiosInstance.patch(
      `/todos/check-todo/${todoId}`,
      { categoryId, status }
    )
    console.log(response)

    return NextResponse.json(
      { message: "Todo status updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to update todo status" },
      { status: 500 }
    )
  }
}

// Handle DELETE request (for deleting a todo and removing it from the category)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {

    
  const session = await getServerSession(authOptions) // ✅ Fetch once
    
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const { categoryId } = await req.json()
    const todoId = (await params).todoId

    const response = (
      await axiosInstance.get(
        `/todos/get-todo/${todoId}`
      )
    ).data
    const todoInDb = response.todo
    const todoIdInDb = todoInDb._id

    const response2 = (
      await axiosInstance.delete(
        `/todos/delete-todo/${todoId}`
      )
    ).data
    console.log(response2)

    const response3 = await axiosInstance.patch(
      `/categories/pull-todo-id/${todoIdInDb}`,
      { categoryId }
    )
    console.log(response3)

    return NextResponse.json(
      { message: "Todo deleted and removed from category successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    )
  }
}
