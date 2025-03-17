import { ApiResponse } from "@/types/apiErrorType"
import { Journal } from "@/types/journalTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError"

export const getJournals = async (uid: string) => {
  try {
    const response = await axios.get(`/api/journals?uid=${uid}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getJournal = async (journalId: string) => {
  try {
    const response = await axios.get(`/api/journals/${journalId}`)
    console.log("Journal", response.data)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const createJournal = async (journalObj: Journal) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`/api/journals`, { journalObj })
    return {success: true, data : response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)
  }
}

export const updateJournal = async (journalObj: Journal) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`/api/journals/${journalObj.id}`, {
      journalObj
    })
    return {success: true, data : response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)

  }
}

export const deleteJournal = async (journalId: string) : Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`/api/journals/${journalId}`)
    return {success: true, data : response.data}
    // console.log(response.data)
  } catch (error) {
    // console.log(error)
    return handleApiError(error)
  }
}
