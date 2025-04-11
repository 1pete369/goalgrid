import { Todo } from "@/types/todoFeatureTypes"
import axios from "axios"

export async function postTodo(todo: Todo, uid: string, categoryId: string) {
  try {
    const response = await axios.post(`/api/category-todos`, {
      todo,
      categoryId
    })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

// Frontend (client-side) function
export async function toggleTodo(
  categoryId: string,
  todoId: string,
  status: boolean
) {
  try {
    const response = await axios.patch(`/api/category-todos/${todoId}`, {
      categoryId, 
      status
    })
    console.log(response.data) // Handle response here
  } catch (error) {
    console.log(error)
  }
}

// Frontend (client-side) function
export async function deleteTodo(todoId: string, categoryId: string) {
  try {
    const response = await axios.delete(`/api/category-todos/${todoId}`, {
      data: { categoryId } // You must send data for the categoryId
    })
    console.log(response.data) // Handle response here
  } catch (error) {
    console.log(error)
  }
}
