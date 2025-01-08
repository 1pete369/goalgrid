import { Todo } from "@/types/todoFeatureTypes"
import axios from "axios"

export async function postTodo(todo: Todo, uid: string, categoryId: string) {
  try {
    const response = (
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/todos/create-todo`, {
        todo
      })
    ).data
    console.log(response)
    const todoObjectId = response.newTodoObject._id
    console.log("TodoObjectId", todoObjectId)
    const response2 = await (
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/push-todo-id/${uid}`,
        { todoObjectId, categoryId }
      )
    ).data
    console.log(response2)
  } catch (error) {
    console.log(error)
  }
}

export async function toggleTodo(categoryId : string, todoId : string, status: boolean) {
    try{
        const response = await (await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/todos/check-todo/${todoId}`,{categoryId, status})).data
        console.log(response)
    }catch(error){  
        console.log(error)
    }
}

export async function deleteTodo(todoId : string, categoryId : string) {
    try{
        console.log("categoryId" , categoryId)
        const response = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/todos/get-todo/${todoId}`)).data

        const todoInDb =  response.todo
        const todoIdInDb = todoInDb._id

        const response2 = (await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todos/delete-todo/${todoId}`)).data
        console.log(response2)

        const response3 = await (await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/categories/pull-todo-id/${todoIdInDb}`,{categoryId})).data
        console.log(response3)
        
    }catch(error){
        console.log(error)
    }
}