// app/api/category-todos/route.ts
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the necessary data
    const { todo, uid, categoryId } = await req.json()

    // Make a request to create the todo
    const response = (
      await axios.post(`${process.env.API_URL}/todos/create-todo`, {
        todo
      })
    ).data
    console.log(response)

    // Extract the new Todo object ID
    const todoObjectId = response.newTodoObject._id
    console.log("TodoObjectId", todoObjectId)

    // Update the category with the new Todo ID
    const response2 = await axios.patch(
      `${process.env.API_URL}/categories/push-todo-id/${uid}`,
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

