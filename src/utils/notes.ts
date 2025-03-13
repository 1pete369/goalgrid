import { Note } from "@/types/noteFeatureTypes"
import axios from "axios"

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

export const createNote = async (noteObj: Note) => {
  try {
    const response = await axios.post("/api/notes", { noteObj })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const updateNote = async (noteObj: Note) => {
  try {
    const response = await axios.patch(`/api/notes/${noteObj.id}`, { noteObj })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const deleteNote = async (noteId: string) => {
  try {
    const response = await axios.delete(`/api/notes/${noteId}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
