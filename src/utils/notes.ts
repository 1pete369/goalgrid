import { Note } from "@/types/noteFeatureTypes"
import axios from "axios"

export const getNotes = async (uid: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/get-notes/${uid}`
    )
    return response.data.notes
  } catch (error) {
    console.log(error)
  }
}

export const getNote = async (noteId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/get-note/${noteId}`
    )
    console.log("Note", response.data.note)
    return response.data.note


  } catch (error) {
    console.log(error)
  }
}

export const createNote = async (noteObj: Note) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/create-note`,
      { noteObj }
    )
    console.log(response.data.noteCreated)
  } catch (error) {
    console.log(error)
  }
}

export const updateNote = async (noteObj: Note) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/update-note/${noteObj.id}`,
      { noteObj }
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const deleteNote = async (noteId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/delete-note/${noteId}`)
    console.log(response.data.noteDeleted)
  } catch (error) {
    console.log(error)
  }
}
