import { Journal } from "@/types/journalTypes"
import axios from "axios"

export const getJournals = async (uid: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/get-journals/${uid}`
    )
    return response.data.journals
  } catch (error) {
    console.log(error)
  }
}

export const getJournal = async (journalId : string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/get-journal/${journalId}`
    )
    console.log("Journal", response.data.journal)
    return response.data.journal
  } catch (error) {
    console.log(error)
  }
}

export const createJournal = async (journalObj: Journal) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/create-journal`,
      { journalObj }
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const updateJournal = async (journalObj: Journal) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/update-journal/${journalObj.id}`,
      { journalObj }
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const deleteJournal = async (journalId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/journals/delete-journal/${journalId}`
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
