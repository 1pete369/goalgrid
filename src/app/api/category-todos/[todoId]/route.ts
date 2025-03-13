import { NextResponse } from "next/server"
import axios from "axios"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  try {
    const { categoryId, status } = await req.json()
    const todoId = (await params).todoId

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/todos/check-todo/${todoId}`,
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
  try {
    const { categoryId } = await req.json()
    const todoId = (await params).todoId

    const response = (
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/todos/get-todo/${todoId}`
      )
    ).data
    const todoInDb = response.todo
    const todoIdInDb = todoInDb._id

    const response2 = (
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/todos/delete-todo/${todoId}`
      )
    ).data
    console.log(response2)

    const response3 = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/pull-todo-id/${todoIdInDb}`,
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
