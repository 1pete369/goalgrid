import { CategoryType } from "@/types/todoFeatureTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError"
import { ApiResponse } from "@/types/apiErrorType"

// Fetch all categories for a user
export async function getCategories(uid: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get(`/api/categories`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Create a new category
export async function createCategory(
  category: CategoryType
): Promise<ApiResponse<any>> {
  try {
    const response = await axios.post(`/api/categories`, { category })
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

// Delete a category by ID
export async function deleteCategory(
  categoryId: string
): Promise<ApiResponse<any>> {
  try {
    const response = await axios.delete(`/api/categories/${categoryId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}

export async function updateCategory(categoryId: string) {
  try {
    const response = await axios.patch(`/api/categories/${categoryId}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
