"use client"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import {
  formatDate,
  getLastCompletedDate,
  getTodayDate,
  getYesterdayDate
} from "@/utils/basics"
import { Calendar, Link, Link2, Plus } from "lucide-react"
import React, { ChangeEvent, useEffect, useState } from "react"
import {
  validateHabitDescription,
  validateHabitName
} from "@/utils/validators/habitFormValidatoers"
import { Habit } from "@/types/habitFeatureTypes"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { getHabits, postHabit, updateHabit } from "@/utils/habits"
import { Goal } from "@/types/goalFeatureTypes"
import {
  getGoalByID,
  getGoals,
  updateGoal,
  updateGoalDuration
} from "@/utils/goals"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function HabitFeature() {
  const { user } = useUserContext()
  const [habits, setHabits] = useState<Habit[] | []>([])
  const [habitName, setHabitName] = useState("")
  const [habitDuration, setHabitDuration] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [habitCategory, setHabitCategory] = useState("")
  const [linkedGoal, setLinkedGoal] = useState("")
  const [loading, setLoading] = useState(false)

  const [categoryLocked, setCategoryLocked] = useState(false)

  const [today, setToday] = useState("")

  const [habitNameError, setHabitNameError] = useState("")
  const [habitDescriptionError, setHabitDescriptionError] = useState("")
  const [canCreateHabit, setCanCreateHabit] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [goals, setGoals] = useState<Goal[] | []>([])
  const [groupedHabits, setGroupedHabits] = useState<Record<string, Habit[]>>(
    {}
  )

  const preDefinedHabitCategories = [
    "Productivity",
    "Fitness",
    "Health",
    "Learning",
    "Self-Improvement",
    "Hobbies",
    "Mental Health",
    "Creativity",
    "Work"
  ]

  const preDefinedHabitDurations = [
    { label: "7 days", value: 7 },
    { label: "21 days", value: 21 },
    { label: "30 days", value: 30 },
    { label: "66 days", value: 66 },
    { label: "90 days", value: 90 }
  ]

  const createHabitObject = (
    habitName: string,
    habitDuration: string,
    habitCategory: string,
    habitDescription: string
  ) => {
    // if(user===null) return
    const todayDate = getTodayDate()
    const habit: Habit = {
      uid: user?.uid as string,
      id: crypto.randomUUID(),
      name: habitName,
      description: habitDescription,
      category: habitCategory,
      startDate: todayDate,
      duration: habitDuration,
      streak: {
        current: 0,
        best: 0
      },
      progress: {
        totalCompleted: 0,
        completionRate: 0
      },
      dailyTracking: {},
      status: "active",
      linkedGoal: linkedGoal
    }
    return habit
  }

  const handleHabitName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const habitName = e.target.value
    setHabitName(habitName)
    const error = validateHabitName(habitName.trim())
    if (error !== "") {
      setHabitNameError(error)
    } else {
      setHabitNameError(error)
    }
  }

  const handleHabitDescription = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const habitDescription = e.target.value
    setHabitDescription(habitDescription)
    const error = validateHabitDescription(habitDescription)
    if (error !== "") {
      setHabitDescriptionError(error)
    } else {
      setHabitDescriptionError(error)
    }
  }

  const handleCreateHabit = async () => {
    const habitCreated: Habit = createHabitObject(
      habitName,
      habitDuration,
      habitCategory,
      habitDescription
    )
    console.log(habitCreated)

    setHabits((habits) => [...habits, habitCreated])
    await postHabit(habitCreated)
    if (habitCreated.linkedGoal !== "") {
      await updateGoalDuration(linkedGoal, parseInt(habitDuration))
    }

    setIsDialogOpen(false)
    setHabitName("")
    setHabitDuration("")
    setHabitDescription("")
    setLinkedGoal("")
    setHabitCategory("")
    setCategoryLocked(false)
  }

  const handleSetHabitCategory = (value: string) => {
    setHabitCategory(value)
  }

  const handleSetHabitDuration = (value: string) => {
    setHabitDuration(value)
  }
  const handleSetLinkedGoal = async (value: string) => {
    const goal: Goal = await getGoalByID(value)
    setLinkedGoal(value)
    setHabitCategory(goal.category)
    setCategoryLocked(true)
  }

  const handleCompleteHabit = async (habit: Habit) => {
    const completedHabitId = habit.id
    console.log(habit.name)
    const today = getTodayDate()
    const updatedHabits = habits.map((habit) => {
      if (habit.id === completedHabitId) {
        const isTodayCompleted = habit.dailyTracking[today] || false
        const updatedDailyTracking = {
          ...habit.dailyTracking,
          [today]: !isTodayCompleted
        }
        let streak = habit.streak.current

        const lastCompletedDate = getLastCompletedDate(habit.dailyTracking)

        if (lastCompletedDate) {
          const lastDate = new Date(lastCompletedDate)
          const todayDate = new Date(today)
          const daysDifference = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (daysDifference > 1) {
            streak = 1
          } else if (!isTodayCompleted && updatedDailyTracking[today]) {
            streak += 1
          } else if (isTodayCompleted && !updatedDailyTracking[today]) {
            streak -= 1
          }
        } else {
          streak = updatedDailyTracking[today] ? 1 : 0
        }

        const completedDays =
          Object.values(updatedDailyTracking).filter(Boolean).length
        const totalDays = parseInt(habit.duration)
        const completionRate = (completedDays / totalDays) * 100
        return {
          ...habit,
          dailyTracking: updatedDailyTracking,
          progress: {
            totalCompleted: completedDays,
            completionRate: completionRate
          },
          streak: {
            current: streak,
            best: Math.max(streak, habit.streak.best)
          }
        }
      }
      return habit
    })

    const changedHabit: Habit | undefined = updatedHabits.find(
      (habit) => habit.id === completedHabitId
    )

    if (changedHabit) {
      await updateHabit(changedHabit)
    }

    console.log(changedHabit)

    setHabits(updatedHabits)

    if (changedHabit?.linkedGoal !== "") {
      const linkedGoalId = changedHabit?.linkedGoal

      // Fetch the linked goal (ensure `getGoalByID` is implemented)
      const linkedGoal: Goal = await getGoalByID(linkedGoalId as string)

      const linkedHabits = updatedHabits.filter(
        (habit) => habit.linkedGoal === linkedGoalId
      )

      console.log(linkedHabits)

      const totalProgress = linkedHabits.reduce(
        (sum, habit) => sum + habit.progress.completionRate,
        0
      )
      console.log("Total progress", totalProgress)

      const totalCompleted = linkedHabits.reduce(
        (sum, habit) => sum + habit.progress.totalCompleted,
        0
      )

      console.log("Total completed", totalCompleted)

      const goalCompletionRate = totalProgress / linkedHabits.length || 0

      console.log("Goal Completion Rate", goalCompletionRate)

      const updatedGoal: Goal = {
        ...linkedGoal,
        progress: {
          totalCompleted: totalCompleted,
          completionRate: goalCompletionRate
        }
      }
      await updateGoal(updatedGoal)
    }
  }

  const groupHabitsByCategory = (habits: Habit[]): Record<string, Habit[]> => {
    return habits.reduce((grouped, habit) => {
      if (!grouped[habit.category]) {
        grouped[habit.category] = []
      }
      grouped[habit.category].push(habit)
      return grouped
    }, {} as Record<string, Habit[]>)
  }

  useEffect(() => {
    if (Array.isArray(habits) && habits.length > 0) {
      setGroupedHabits(groupHabitsByCategory(habits))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      setGroupedHabits({})
    }
  }, [habits])

  useEffect(() => {
    setLoading(true)
    if (user !== null) {
      async function fetchHabits() {
        const habits = await getHabits(user?.uid as string)
        setHabits(habits)
      }
      fetchHabits()
      async function fetchGoals() {
        const goals = await getGoals(user?.uid as string)
        setGoals(goals)
      }
      fetchGoals()
    }

    const date = getTodayDate()
    setToday(date)
  }, [user])

  useEffect(() => {
    async function fetchGoals() {
      const goals = await getGoals(user?.uid as string)
      setGoals(goals)
    }
    fetchGoals()
  }, [isDialogOpen])

  useEffect(() => {
    if (
      habitNameError === "" &&
      habitDescriptionError === "" &&
      habitName !== "" &&
      habitDuration !== "" &&
      habitCategory !== ""
    ) {
      setCanCreateHabit(true)
    } else {
      setCanCreateHabit(false)
    }
  }, [
    habitNameError,
    habitDescriptionError,
    habitName,
    habitDuration,
    habitCategory
  ])

  if (user === null)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="">Loading...</p>
      </div>
    )

  return (
    <div className="container md:px-24 p-4 pt-6 min-w-full">
      <header className="text-4xl font-semibold my-3 md:flex gap-20">
        <div>
          Hello, {user?.personalInfo.name.split(" ")[0]}!
          <p className="text-lg text-neutral-500">Create Habits here!</p>
        </div>
        <section>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-semibold text-lg">
                <Plus />
                Add new Habit!
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add new Habit!</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col">
                <div className="">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={habitName}
                    onChange={handleHabitName}
                  />
                  {habitNameError !== "" && (
                    <p className="text-error text-sm">{habitNameError}</p>
                  )}
                </div>
                {/* <div className="">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    className="col-span-3"
                    value={habitDescription}
                    onChange={handleHabitDescription}
                    placeholder="Optional"
                  />
                  {habitDescriptionError !== "" && (
                    <p className="text-error text-sm">
                      {habitDescriptionError}
                    </p>
                  )}
                </div> */}
                <div className="flex justify-between">
                  <div className="mt-4">
                    <Select
                      value={habitDuration}
                      onValueChange={(value) => handleSetHabitDuration(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Habit Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="">
                          <SelectLabel>Habit Duration</SelectLabel>
                          {preDefinedHabitDurations.map((duration, i) => {
                            return (
                              <SelectItem
                                key={i}
                                value={duration.value.toString()}
                              >
                                {duration.label}
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-4">
                    <Select
                      value={habitCategory}
                      onValueChange={(value) => handleSetHabitCategory(value)}
                      disabled={categoryLocked}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Habit Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="">
                          <SelectLabel>Habit Category</SelectLabel>
                          {preDefinedHabitCategories.map((category) => {
                            return (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Select
                    value={linkedGoal}
                    onValueChange={(value) => handleSetLinkedGoal(value)}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Link habit to a goal! (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="">
                        <SelectLabel>Link a Goal!</SelectLabel>
                        {Array.isArray(goals) &&
                          goals.length > 0 &&
                          goals.map((goal, i) => {
                            return (
                              <SelectItem key={i} value={goal.id}>
                                {goal.name}
                              </SelectItem>
                            )
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={!canCreateHabit}
                  type="submit"
                  className="w-[200px] mx-auto"
                  onClick={handleCreateHabit}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </header>
      <section className="flex flex-col mt-4 gap-6">
        {Object.entries(groupedHabits).length > 0 ? (
          Object.entries(groupedHabits).map(([category, categoryHabits]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-2">{category}</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {categoryHabits.map((habit) => (
                  <Card
                    className="w-full border-none rounded-none shadow-md hover:shadow-lg flex flex-col justify-between overflow-hidden gap-2"
                    key={habit.id}
                  >
                    <CardHeader className="relative flex flex-row py-2 px-2 justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">
                          {habit.streak.current}
                        </span>
                        <Image
                          src={"/flame.png"}
                          height={15}
                          width={15}
                          alt="streak"
                          // className="h-5 w-5"
                        />
                      </div>
                      <p className="text-sm text-gray-500 underline">
                        {habit.progress.totalCompleted}/{habit.duration} days
                      </p>
                      {/* Linked Goal Icon */}
                      {habit.linkedGoal !== "" && (
                        <Image
                          src={"/goalLink.png"}
                          sizes="10"
                          width={25}
                          height={25}
                          className="absolute -top-5 -right-3"
                          alt="linkedGoal"
                        />
                      )}
                    </CardHeader>
                    <CardContent className="p-0 pl-3 mb-1">
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          id={habit.id}
                          onCheckedChange={() => handleCompleteHabit(habit)}
                          checked={habit.dailyTracking[getTodayDate()] || false}
                          className="h-6 w-6 rounded-sm border-green-500 data-[state=checked]:bg-green-500 /data-[state=checked]:text-black "
                        />
                        <div className="">
                          <Label
                            htmlFor={habit.id}
                            className="text-base font-semibold"
                          >
                            {habit.name.toWellFormed()}
                          </Label>
                          {/* {habit.description && (
                            <p className="text-neutral-500 text-sm break-all">
                              {habit.description.toWellFormed()}
                            </p>
                          )} */}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 m-0 relative ">
                      <Progress
                        value={habit.progress.completionRate}
                        className="w-full h-2 rounded-none bg-green-50"
                        color="bg-success"
                      />
                    </CardFooter>
                  </Card>
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
