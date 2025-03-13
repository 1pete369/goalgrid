import { ApiError } from "@/types/apiErrorType";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    let customMessage = "An unexpected error occurred.";

    switch (status) {
      case 400:
        customMessage = "Bad Request: Please check your input.";
        break;
      case 401:
        customMessage = "Unauthorized: Please log in.";
        break;
      case 403:
        customMessage = "Forbidden: You don't have permission.";
        break;
      case 404:
        customMessage = "Resource not found.";
        break;
      case 500:
        customMessage = "Server error. Please try again later.";
        break;
      default:
        customMessage = errorMessage || "Something went wrong.";
    }

    return { success: false, status, message: customMessage };
  }

  return { success: false, message: "An unknown error occurred." };
};
