"use client"
import { getTodayDate, getYesterdayDate } from "@/utils/basics"

import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Goal } from "@/types/goalFeatureTypes"
import { Habit } from "@/types/habitFeatureTypes"
import { getGoalByID, getGoals, updateGoal } from "@/utils/goals"
import { getHabits, updateHabit } from "@/utils/habits"
import { useEffect, useRef, useState } from "react"
import HabitCard from "./HabitFeatureComponents/HabitCardComponents/HabitCard"
import HabitFeatureForm from "./HabitFeatureComponents/HabitFeatureForm"
import useHabitHandler from "./HabitFeatureComponents/useHabitHandler"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import HabitsSkeleton from "@/skeletons/HabitSkeleton"
import { ArrowDownIcon, ArrowUpIcon, EllipsisVertical } from "lucide-react"

export default function HabitFeature() {
  const [habits, setHabits] = useState<Habit[] | []>([])
  const [loading, setLoading] = useState(false)
  const { user } = useUserContext()
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[] | []>([])
  const fetchedRef = useRef(false) // ✅ Track if data is already fetched

  const { handleCompleteHabit } = useHabitHandler(habits, setHabits) // Use the custom hook

  const [groupedHabits, setGroupedHabits] = useState<Record<string, Habit[]>>(
    {}
  )
  const [sortBy, setSortBy] = useState<"duration" | "category">("duration") // Default: Streak duration
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Default: Descending

  async function updateMissedStreaks(habitsData: Habit[]) {
    const yesterday = getYesterdayDate()
    const todayISO = new Date().toISOString().split("T")[0]

    const lastUpdate = JSON.parse(
      localStorage.getItem("isMissedHabitStreakUpdatedToday") || "{}"
    )
    if (lastUpdate.date === todayISO) {
      console.log("✅ Streak check already done today.")
      return habitsData
    }

    console.log("🔄 Checking for missed streaks...")
    const habitsToUpdate = habitsData.filter(
      (habit) => !habit.dailyTracking[yesterday] && habit.startDate !== todayISO && habit.status!=="completed"
    )

    if (habitsToUpdate.length === 0) {
      console.log("✅ No streaks to reset.")
      localStorage.setItem(
        "isMissedHabitStreakUpdatedToday",
        JSON.stringify({ date: todayISO })
      )
      return habitsData
    }

    console.log(`🔄 Resetting streaks for ${habitsToUpdate.length} habits...`)

    const updatedHabits = await Promise.all(
      habitsToUpdate.map(async (habit) => {
        const updatedHabit = {
          ...habit,
          streak: {
            current: 0,
            best: Math.max(habit.streak.best, habit.streak.current)
          },
          dailyTracking: { ...habit.dailyTracking, [yesterday]: false }
        }

        if (!habit.dailyTracking[todayISO]) {
          updatedHabit.dailyTracking[todayISO] = false
        }

        try {
          await updateHabit(updatedHabit)
          console.log(`✅ Habit "${habit.name}" streak reset.`)
        } catch (err) {
          console.error(`❌ Failed to update "${habit.name}":`, err)
        }
        return updatedHabit
      })
    )

    localStorage.setItem(
      "isMissedHabitStreakUpdatedToday",
      JSON.stringify({ date: todayISO })
    )

    console.log("✅ Streak updates completed!")

    return habitsData.map((habit) =>
      habitsToUpdate.some((updated) => updated.id === habit.id)
        ? updatedHabits.find((updated) => updated.id === habit.id) || habit
        : habit
    )
  }

  async function updateHabitsStatus(habitsData : Habit[]) {
    const todayDate = getTodayDate() // Get today's date in YYYY-MM-DD format

    console.log("todayDate", todayDate)

    // Filter habits that need updating
    const updatedHabits: Habit[] = habitsData.map((habit) => {
      return habit.endDate === todayDate
        ? { ...habit, status: "completed" }
        : habit
    })

    console.log("updatedHabits ", updatedHabits)
    // Update state first

    // Filter only habits that were actually updated
    const habitsToUpdate = updatedHabits.filter(
      (habit) => habit.endDate === todayDate && habit.status==="active"
    )

    console.log("habits to update", habitsToUpdate)

    if (habitsToUpdate.length > 0) {
      try {
        // Send API request for all updated habits
        await Promise.all(
          habitsToUpdate.map((habit) => updateHabit(habit)) // ✅ Call the correct function
        )
        console.log("✅ All habits updated successfully in the database!")
      } catch (error) {
        console.error("❌ Failed to update habits in the database:", error)
      }
    } else {
      console.log("⚡ No habits needed updating today.")
    }
    setHabits(updatedHabits)
  }

  async function fetchAndProcessHabits(
    userId: string,
    setHabits: Function,
    fetchedRef: React.MutableRefObject<boolean>
  ) {
    console.log("🚀 Fetching habits...")

    let result = await getHabits(userId)
    if(result.success){
      let habitsData : Habit[]= result.data
      console.log(habitsData)
      
      habitsData = await updateMissedStreaks(habitsData)
      
      setHabits(habitsData)
      await updateHabitsStatus(habitsData)
      setGroupedHabits(groupHabitsByCategory(habitsData))
      fetchedRef.current = true
    }
  }

  async function updateTheGoalData(
    habit: Habit,
    updatedHabits?: Habit[],
    isDeleted?: boolean
  ) {
    if (!habit.linkedGoal) return
    let habitsUsing = habits
    if (isDeleted === false) {
      if (updatedHabits) {
        habitsUsing = updatedHabits
      }
    }

    const goalId = habit.linkedGoal
    const result = await getGoalByID(goalId)
    if (result.success) {
      const linkedGoal = result.data
      if (!linkedGoal) return

      const linkedHabits = isDeleted
        ? habitsUsing.filter(
            (h) => h.linkedGoal === goalId && h.id !== habit.id
          )
        : habitsUsing.filter((h) => h.linkedGoal === goalId)

      console.log(linkedHabits)
      const totalProgress = linkedHabits.reduce(
        (sum, h) => sum + h.progress.completionRate,
        0
      )
      const totalCompleted = linkedHabits.reduce(
        (sum, h) => sum + h.progress.totalCompleted,
        0
      )
      const goalCompletionRate = linkedHabits.length
        ? totalProgress / linkedHabits.length
        : 0

      const updatedGoal = {
        ...linkedGoal,
        progress: {
          totalCompleted,
          completionRate: goalCompletionRate
        }
      }

      await updateGoal(updatedGoal)
    }
  }

  const groupHabitsByCategory = (habits: Habit[]) => {
    // Group habits by category
    return habits.reduce((acc, habit) => {
      if (!habit.category)
        return acc // Skip habits without categories
      ;(acc[habit.category] ||= []).push(habit) // Group by category
      return acc
    }, {} as Record<string, Habit[]>)
  }

  const sortHabits = (habits: Habit[], sortBy: string, sortOrder: string) => {
    const sortedHabits = [...habits]

    sortedHabits.sort((a, b) => {
      if (sortBy === "duration") {
        return sortOrder === "asc"
          ? Number(a.duration) - Number(b.duration)
          : Number(b.duration) - Number(a.duration)
      }

      if (sortBy === "category") {
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
      }

      return 0 // Default: no sorting
    })

    return sortedHabits
  }

  const handleSortChange = (value: "duration" | "category") => {
    setSortBy(value)
    setSortOrder("asc") // You can set this to any default order or leave it as "asc"
  }

  useEffect(() => {
    if (habits.length > 0) {
      // Sort the habits based on the current sort criteria and order
      const sortedHabits = sortHabits(habits, sortBy, sortOrder)

      // Update the grouped habits while maintaining the sort order
      setGroupedHabits(groupHabitsByCategory(sortedHabits))
    }
  }, [habits, sortBy, sortOrder])

  useEffect(() => {
    if (user !== null && !fetchedRef.current) {
      fetchedRef.current = true

      async function fetchData() {
        setLoading(true)
        await fetchAndProcessHabits(user?.uid as string, setHabits, fetchedRef)
        const result = await getGoals(user?.uid as string)
        if (result.success) {
          const goals: Goal[] = result.data
          setGoals(goals)
        }
        setLoading(false)
      }
      fetchData()
    }
  }, [user])

  if (user === null) return <FullPageLoading />
  return (
    <div className="container min-h-screen md:px-16 p-4 pt-20">
      <div className="flex md:flex-row gap-2 md:gap-4 items-center justify-between ">
        <div className="flex gap-5 items-center">
          <Greetings feature="habits" />
          <div className=" gap-4 items-center hidden lg:flex flex-row">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="p-2 py-4 border rounded w-[200px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  {/* <SelectItem value="streak">Streak</SelectItem>{" "} */}
                  {/* ✅ New Streak Option */}
                  <SelectItem value="duration">Duration (Days)</SelectItem>{" "}
                  {/* ✅ Sort by Habit Duration */}
                  <SelectItem value="category">Category</SelectItem>
                  {/* <SelectItem value="createdAt">Created At</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border rounded"
            >
              {sortOrder === "asc" ? (
                <ArrowUpIcon size={16} className="" />
              ) : (
                <ArrowDownIcon size={16} className="" />
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          <HabitFeatureForm
            goals={goals}
            habits={habits}
            setHabits={setHabits}
            updateTheGoalData={updateTheGoalData}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:hidden">
              <EllipsisVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>Sorting</DropdownMenuLabel>
              <div className=" gap-4 items-center flex flex-row">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="p-2 py-4 border rounded w-[200px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      {/* <SelectItem value="streak">Streak</SelectItem>{" "} */}
                      {/* ✅ New Streak Option */}
                      <SelectItem value="duration">
                        Duration (Days)
                      </SelectItem>{" "}
                      {/* ✅ Sort by Habit Duration */}
                      <SelectItem value="category">Category</SelectItem>
                      {/* <SelectItem value="createdAt">Created At</SelectItem> */}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border rounded"
                >
                  {sortOrder === "asc" ? (
                    <ArrowUpIcon size={16} className="" />
                  ) : (
                    <ArrowDownIcon size={16} className="" />
                  )}
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ✅ Sorting Controls */}
      <section className="flex flex-col mt-4 space-y-6">
        {loading ? (
          <HabitsSkeleton />
        ) : Object.entries(groupedHabits).length > 0 ? (
          Object.entries(groupedHabits).map(([category, categoryHabits]) => (
            <div key={category}>
              <h2 className="text-base font-semibold mb-2">{category}</h2>
              <div className="flex flex-col md:flex-row flex-wrap  gap-4">
                {categoryHabits.map((habit, i) => (
                  <HabitCard
                    goals={goals}
                    key={i}
                    habit={habit}
                    handleCheckboxClick={handleCompleteHabit}
                    setHabits={setHabits}
                    updateTheGoalData={updateTheGoalData}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-500">No habits yet!</p>
        )}
      </section>
    </div>
  )
}
