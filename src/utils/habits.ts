import { Habit } from "@/types/habitFeatureTypes"
import axios from "axios"

export async function postHabit(habit: Habit) {
  try {
    const response = (
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/habits/create-habit/${habit.uid}`,
        { habit }
      )
    ).data
    console.log(response)
    if (habit.linkedGoal !== "") {
      const habitCreated = response.habitCreated
      const habitIdInDb = habitCreated._id
      const linkedGoalId = habit.linkedGoal

      console.log(habitIdInDb)
      console.log(linkedGoalId)
      const response2 = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/link-habit/${habit.uid}`,
        { habitIdInDb, linkedGoalId }
      )
      console.log(response2.data)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function updateHabit(habit: Habit) {
  try {
    const response = (
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/habits/update-habit-status/${habit.id}`,
        { habit }
      )
    ).data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export async function getHabits(uid: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/habits/get-habits/${uid}`
    )
    console.log(response.data)
    const habits = response.data.habits
    return habits
  } catch (error) {
    console.log(error)
  }
}
