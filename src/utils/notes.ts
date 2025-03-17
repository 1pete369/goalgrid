import { ApiResponse } from "@/types/apiErrorType"
import { Note } from "@/types/noteFeatureTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError"

export const getNotes = async (uid: string) => {
  try {
    const response = await axios.get(`/api/notes?uid=${uid}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getNote = async (noteId: string) => {
  try {
    console.log("Get note called")
    const response = await axios.get(`/api/notes/${noteId}`)
    console.log("Note", response.data)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const createNote = async (noteObj: Note) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post("/api/notes", { noteObj })
    return {success: true, data: response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)
  }
}

export const updateNote = async (noteObj: Note) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`/api/notes/${noteObj.id}`, { noteObj })
    return {success: true, data: response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)
  }
}

export const deleteNote = async (noteId: string) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`/api/notes/${noteId}`)
    return {success: true, data: response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)
  }
}
