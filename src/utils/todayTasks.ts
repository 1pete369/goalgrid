import { Task } from "@/types/todayTodoFeatureTypes";
import axios from "axios";
import { handleApiError } from "./handleApiError";
import { ApiResponse } from "@/types/apiErrorType";

// Create a new task
export async function postTask(task: Task): Promise<ApiResponse<any>> {
  try {
    const response = await axios.post(`/api/today-tasks`, { task });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

// Fetch all tasks for a user
export async function getTasks(uid: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get(`/api/today-tasks?uid=${uid}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

// Toggle task completion status
export async function toggleTask(taskId: string, completedStatus: boolean): Promise<ApiResponse<any>> {
  try {
    const response = await axios.patch(`/api/today-tasks/${taskId}`, { completedStatus });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a task by ID
export async function deleteTask(taskId: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.delete(`/api/today-tasks/${taskId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
}
