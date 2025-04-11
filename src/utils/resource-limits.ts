import axios from "axios"
import { handleApiError } from "./handleApiError"
import { ApiResponse } from "@/types/apiErrorType"

export async function getResourceCount(
  resourceName:
    | "habits"
    | "goals"
    | "tasks"
    | "categories"
    | "notes"
    | "journals",
): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get("/api/resource-count", {
      params: { resourceName }
    })

    console.log(response.data)

    return { success: true, data: response.data }
  } catch (error) {
    return handleApiError(error)
  }
}
