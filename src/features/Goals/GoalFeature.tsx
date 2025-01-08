"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import React, { ChangeEvent, useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Goal } from "@/types/goalFeatureTypes"
import {
  validateGoalDescription,
  validateGoalName
} from "@/utils/validators/goalFormValidators"
import { formatDate, getTodayDate } from "@/utils/basics"
import { getGoals, postGoal } from "@/utils/goals"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Habit } from "@/types/habitFeatureTypes"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export default function GoalFeature() {
  const { user } = useUserContext()
  const [goals, setGoals] = useState<Goal[] | []>([])
  const [goalName, setGoalName] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalCategory, setGoalCategory] = useState("")

  const [today, setToday] = useState("")

  const [goalNameError, setGoalNameError] = useState("")
  const [goalDescriptionError, setGoalDescriptionError] = useState("")
  const [canCreateGoal, setCanCreateGoal] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const preDefinedGoalCategories = [
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

  const createGoalObject = (
    goalName: string,
    goalDescription: string,
    goalCategory: string
  ) => {
    const todayDate = getTodayDate()
    const goal: Goal = {
      id: crypto.randomUUID(),
      uid: user?.uid as string,
      name: goalName,
      description: goalDescription,
      createdAt: todayDate,
      category: goalCategory,
      duration: 0,
      habits: [],
      progress: {
        totalCompleted: 0,
        completionRate: 0
      },
      status: "active"
    }
    return goal
  }

  const handleCreateGoal = async () => {
    const goalCreated: Goal = createGoalObject(
      goalName,
      goalDescription,
      goalCategory
    )
    console.log(goalCreated)
    setGoals((goals) => [...goals, goalCreated])
    await postGoal(goalCreated)
    setGoalName("")
    setGoalDescription("")
    setGoalCategory("")
    setIsDialogOpen(false)
  }

  const handleGoalName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const goalName = e.target.value
    setGoalName(goalName)
    const error = validateGoalName(goalName.trim())
    if (error !== "") {
      setGoalNameError(error)
    } else {
      setGoalNameError(error)
    }
  }

  const handleGoalDescription = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const goalDescription = e.target.value
    setGoalDescription(goalDescription)
    const error = validateGoalDescription(goalDescription)
    if (error !== "") {
      setGoalDescriptionError(error)
    } else {
      setGoalDescriptionError(error)
    }
  }

  useEffect(() => {}, [goals])

  useEffect(() => {
    if (user !== null) {
      async function fetchGoals() {
        const goals = await getGoals(user?.uid as string)
        setGoals(goals)
      }
      fetchGoals()
    }
  }, [user])

  useEffect(() => {
    if (
      goalName !== "" &&
      goalDescription !== "" &&
      goalNameError === "" &&
      goalDescriptionError === "" &&
      goalCategory !== ""
    ) {
      setCanCreateGoal(true)
    } else {
      setCanCreateGoal(false)
    }
  }, [
    goalName,
    goalDescription,
    goalNameError,
    goalDescriptionError,
    goalCategory
  ])

  return (
    <div className="container min-h-[cal(100vh)] md:px-24 p-4 pt-6 min-w-full">
      <header className="text-4xl font-semibold my-3">
        Hello, {user?.personalInfo.name.split(" ")[0]}!
        <p className="text-lg text-neutral-500">Create Goals here!</p>
      </header>
      <section>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold text-lg">
              <Plus />
              Add new Goal!
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new Goal!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={goalName}
                  onChange={handleGoalName}
                />
                {goalNameError !== "" && (
                  <p className="text-error text-sm">{goalNameError}</p>
                )}
              </div>
              <div className="">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  value={goalDescription}
                  onChange={handleGoalDescription}
                />
                {goalDescriptionError !== "" && (
                  <p className="text-error text-sm">{goalDescriptionError}</p>
                )}
              </div>
              <div className="flex justify-between">
                <div className="mt-4">
                  <Select
                    value={goalCategory}
                    onValueChange={(value) => setGoalCategory(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Goal Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="">
                        <SelectLabel>Goal Category</SelectLabel>
                        {preDefinedGoalCategories.map((category) => {
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
            </div>
            <DialogFooter>
              <Button
                disabled={!canCreateGoal}
                type="submit"
                className="w-[200px] mx-auto"
                onClick={handleCreateGoal}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <section className=" flex flex-col gap-4 mt-4">
        {Array.isArray(goals) && goals.length > 0 ? (
          goals.map((goal) => {
            return (
              <Card className="w-[300px] border rounded-sm" key={goal.id}>
                <CardHeader className="flex">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      <p>{formatDate(goal.createdAt)}</p>
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="">
                    <Label htmlFor={goal.id} className="text-lg font-semibold">
                      {goal.name.toWellFormed()}
                    </Label>
                    <p className="text-neutral-500 text-sm break-all">
                      {goal.description.toWellFormed()}
                    </p>
                  </div>
                  <div className=" relative p-0 m-0 ">
                    <Progress
                      value={goal.progress.completionRate}
                      className="w-full h-8 rounded-none bg-green-50"
                      color="bg-success"
                    />
                    <p className="absolute translate-x-24 -translate-y-6 text-sm flex">
                      {goal.progress.totalCompleted}/{goal.duration} days
                    </p>
                  </div>
                  {goal.habits.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="text-lg">
                          Habits in progress
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col mt-2 gap-1">
                          {goal.habits.map((habit: Habit) => {
                            return (
                              <p key={habit.id} className="text-neutral-500">
                                {habit.name}
                              </p>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="mt-4">No goals yet!</p>
        )}
      </section>
    </div>
  )
}
