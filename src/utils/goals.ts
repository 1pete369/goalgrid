import { Goal } from "@/types/goalFeatureTypes"
import axios from "axios"

export async function postGoal(goal: Goal) {
  try {
    const response = (
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/create-goal/${goal.uid}`,
        { goal }
      )
    ).data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export async function updateGoal(goal: Goal) {
  try {
    const response = (
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/update-goal-status/${goal.id}`,
        { goal }
      )
    ).data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export async function updateGoalDuration(goalId: string, duration : number) {
  try {
    const response = (
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/update-goal-duration/${goalId}`,
        { duration }
      )
    ).data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}


export async function getGoals(uid: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/goals/get-goals/${uid}`
    )
    console.log(response.data)
    const goals = response.data.goals
    return goals
  } catch (error) {
    console.log(error)
  }
}


export async function getGoalByID(goalId : string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/goals/get-goal/${goalId}`
    )
    console.log(response.data)
    return response.data.goal
  } catch (error) {
    console.log(error)
  }
}