import { Goal } from "@/types/goalFeatureTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError"
import { ApiResponse } from "@/types/apiErrorType"

// Create a new goal
export async function postGoal(goal: Goal): Promise<ApiResponse<any>> {
  try {
    const response = await axios.post(`/api/goals`, { goal })
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Update an existing goal
export async function updateGoal(goal: Goal): Promise<ApiResponse<any>> {
  try {
    console.log("updated goals called")
    const response = await axios.patch(`/api/goals/${goal.id}`, { goal })
    console.log("updated goals completed")
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Fetch all goals for a user
export async function getGoals(uid: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get(`/api/goals`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Fetch a single goal by ID
export async function getGoalByID(goalId: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get(`/api/goals/${goalId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Delete a goal by ID
export async function deleteGoal(
  goalId: string,
  linkedHabits: string[]
): Promise<ApiResponse<any>> {
  try {
    const response = await axios.delete(`/api/goals/${goalId}`, {
      data: { linkedHabits }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}
