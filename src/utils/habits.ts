import { Habit } from "@/types/habitFeatureTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError" // Assuming handleApiError is already implemented
import { ApiResponse } from "@/types/apiErrorType"

// Function to post a new habit
export async function postHabit(habit: Habit): Promise<ApiResponse<any>> {
  try {
    const response = await axios.post(`/api/habits`, { habit })
    console.log(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Function to update an existing habit
export async function updateHabit(habit: Habit): Promise<ApiResponse<any>>  {
  try {
    const response = await axios.patch(`/api/habits/${habit.id}`, { habit })
    console.log(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Function to get habits for a user by UID
export async function getHabits(uid: string): Promise<ApiResponse<any>>  {
  try {
    const response = await axios.get(`/api/habits?uid=${uid}`)
    console.log(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Function to delete a habit
export async function deleteHabit(habitId: string): Promise<ApiResponse<any>>  {
  try {
    const response = await axios.delete(`/api/habits/${habitId}`)
    console.log(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// export async function  updateHabitStatus(habit: Habit) {
//   try {
//     const response = await axios.patch(`/api/habits/${habit.id}`,{status : habit.status});
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     // Log errors only in development
//     if (process.env.NODE_ENV === 'development') {
//       console.error("Error Deleting habits:", error);
//     }
//   }
// }
