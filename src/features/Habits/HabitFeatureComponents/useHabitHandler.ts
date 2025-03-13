import { Habit } from "@/types/habitFeatureTypes"
import { getLastCompletedDate, getTodayDate } from "@/utils/basics"
import { getGoalByID, updateGoal } from "@/utils/goals"
import { updateHabit } from "@/utils/habits"
import { debounce } from "lodash"

/**
 * Handles habits (streak tracking, progress calculation, goal updates)
 */
export default function useHabitHandler(
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
) {
  const handleCompleteHabit = debounce(async (habit: Habit) => {
    const today = getTodayDate()
    const updatedHabits = updateHabitState(habit, today, habits)

    // Optimistic UI update
    setHabits(updatedHabits)

    // Find the changed habit
    const changedHabit = updatedHabits.find((h) => h.id === habit.id)

    if (changedHabit) {
      await updateHabit(changedHabit) // Async backend update
    }

    if (habit.linkedGoal !== "" && changedHabit) {
      updateLinkedGoal(changedHabit, updatedHabits)
    }
    
  }, 100)

  return { handleCompleteHabit }
}

/**
 * Updates habit state optimistically
 */

function updateHabitState(
  habit: Habit,
  today: string,
  habits: Habit[]
): Habit[] {
  return habits.map((h) => {
    if (h.id !== habit.id) return h

    const isTodayCompleted = h.dailyTracking[today] || false
    const updatedDailyTracking = {
      ...h.dailyTracking,
      [today]: !isTodayCompleted
    }

    const newStreak = calculateStreak(h, today, updatedDailyTracking)
    const newProgress = calculateCompletionRate(
      updatedDailyTracking,
      h.duration
    )

    return {
      ...h,
      dailyTracking: updatedDailyTracking,
      streak: newStreak,
      progress: newProgress
    }
  })
}

function calculateLongestConsecutiveStreak(
  dailyTracking: Record<string, boolean>
) {
  let longestStreak = 0
  let currentStreak = 0

  // Loop through all the dates in dailyTracking
  const trackingDates = Object.keys(dailyTracking).sort() // Sorting to ensure the dates are in order
  for (const date of trackingDates) {
    if (dailyTracking[date]) {
      currentStreak++ // Increment streak if the day is marked as completed
      longestStreak = Math.max(longestStreak, currentStreak) // Update the longest streak
    } else {
      currentStreak = 0 // Reset streak if a day is marked incomplete
    }
  }

  return longestStreak // Return the longest consecutive streak
}

/**
 * Calculates the habit streak
 */
function calculateStreak(
  habit: Habit,
  today: string,
  tracking: Record<string, boolean>
) {
  let streak = habit.streak.current
  const lastCompletedDate = getLastCompletedDate(tracking)

  if (lastCompletedDate) {
    const lastDate = new Date(lastCompletedDate)
    const todayDate = new Date(today)
    const daysDifference = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDifference > 1) {
      streak = tracking[today] ? 1 : 0; // Reset streak if a day was missed
    } else if (!habit.dailyTracking[today] && tracking[today]) {
      streak += 1 // Increment streak if marking complete
    } else if (habit.dailyTracking[today] && !tracking[today]) {
      streak -= 1 // Decrement streak if marking incomplete
    }
  } else {
    streak = tracking[today] ? 1 : 0
  }

  const bestStreak = calculateLongestConsecutiveStreak(tracking)

  return { current: streak, best: bestStreak }
}

/**
 * Calculates habit completion rate
 */
function calculateCompletionRate(
  tracking: Record<string, boolean>,
  duration: string
) {
  const completedDays = Object.values(tracking).filter(Boolean).length
  const totalDays = parseInt(duration)
  return {
    totalCompleted: completedDays,
    completionRate: (completedDays / totalDays) * 100
  }
}

/**
 * Updates a linked goal based on habit progress
 */
async function updateLinkedGoal(habit: Habit, habits: Habit[]) {
  const linkedGoalId = habit.linkedGoal
  if (!linkedGoalId) return // Ensure goal exists
  const result = await getGoalByID(linkedGoalId as string)
  if(result.success){
    const linkedGoal= result.data
    if (!linkedGoal) return // Ensure valid goal object
    
    const linkedHabits = habits.filter((h) => h.linkedGoal === linkedGoalId)

    if (linkedHabits.length === 0) return // Avoid division by zero
    
    // Calculate goal progress
    const totalProgress = linkedHabits.reduce(
      (sum, h) => sum + h.progress.completionRate,
      0
    )
  const totalCompleted = linkedHabits.reduce(
    (sum, h) => sum + h.progress.totalCompleted,
    0
  )
  const goalCompletionRate = totalProgress / linkedHabits.length || 0
  
  const updatedGoal = {
    ...linkedGoal,
    progress: {
      totalCompleted: totalCompleted,
      completionRate: goalCompletionRate
    }
  }
  
  
  await updateGoal(updatedGoal)
}
}
