export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; status?: number; message: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
