import { Journal } from "@/types/journalTypes"
import axios from "axios"

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

export const createJournal = async (journalObj: Journal) => {
  try {
    const response = await axios.post(`/api/journals`, { journalObj })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const updateJournal = async (journalObj: Journal) => {
  try {
    const response = await axios.patch(`/api/journals/${journalObj.id}`, {
      journalObj
    })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const deleteJournal = async (journalId: string) => {
  try {
    const response = await axios.delete(`/api/journals/${journalId}`)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
