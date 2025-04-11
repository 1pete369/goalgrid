import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Goal } from "@/types/goalFeatureTypes"
import { Habit } from "@/types/habitFeatureTypes"
import { getEndDate, getTodayDate } from "@/utils/basics"
import { getGoalByID } from "@/utils/goals"
import { postHabit } from "@/utils/habits"
import { validateHabitName } from "@/utils/validators/habitFormValidatoers"
import { Loader2, Plus } from "lucide-react"
import {
  preDefinedHabitCategories,
  preDefinedHabitDurations
} from "./HabitFeatureConstants"
import { getResourceCount } from "@/utils/resource-limits"
import { useCustomToast } from "@/hooks/useCustomToast"

type HabitFeatureFormPropsType = {
  habits: Habit[]
  setHabits: React.Dispatch<SetStateAction<Habit[] | []>>
  updateTheGoalData: (
    habit: Habit,
    updatedHabits: Habit[],
    isDeleted?: boolean
  ) => Promise<void>
  goals: Goal[]
}

export default function HabitFeatureForm({
  setHabits,
  updateTheGoalData,
  habits,
  goals
}: HabitFeatureFormPropsType) {
  const { user } = useUserContext()
  const [habitName, setHabitName] = useState("")
  const [habitDuration, setHabitDuration] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [habitCategory, setHabitCategory] = useState("")
  const [linkedGoal, setLinkedGoal] = useState("")
  const [habitNameError, setHabitNameError] = useState("")
  const [habitDescriptionError, setHabitDescriptionError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [habitColor, setHabitColor] = useState("")
  const [loading, setLoading] = useState(false)

  const [colorsLocked, setColorsLocked] = useState(false)
  const [categoryLocked, setCategoryLocked] = useState(false)
  const [durationLocked, setDurationLocked] = useState(false)

  const [canCreateHabit, setCanCreateHabit] = useState(false)

  const { showToast } = useCustomToast()

  // const [goals, setGoals] = useState<Goal[] | []>([])

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

  const handleSetHabitCategory = (value: string) => {
    setHabitCategory(value)
  }

  const handleSetHabitDuration = (value: string) => {
    setHabitDuration(value)
  }
  const handleSetLinkedGoal = async (value: string) => {
    setLoading(true)
    const result = await getGoalByID(value)
    if (result.success && "data" in result) {
      const goal: Goal = result.data
      setLinkedGoal(value)
      setHabitCategory(goal.category)
      setHabitColor(goal.goalColor)
      setHabitDuration(goal.duration)
      setCategoryLocked(true)
      setDurationLocked(true)
      setColorsLocked(true)
      setLoading(false)
    }
  }

  const createHabitObject = (
    habitName: string,
    habitDuration: string,
    habitCategory: string,
    habitDescription: string
  ) => {
    // if(user===null) return
    const todayDate = getTodayDate()
    const endDate = getEndDate(todayDate, habitDuration)
    const habit: Habit = {
      uid: user?.uid as string,
      id: crypto.randomUUID(),
      name: habitName,
      description: habitDescription,
      category: habitCategory,
      startDate: todayDate,
      endDate: endDate,
      createdAt: new Date(),
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
      linkedGoal: linkedGoal,
      habitColor: habitColor
    }
    return habit
  }

  const handleCreateHabit = async () => {
    setLoading(true)
    const resourceResult = await getResourceCount( "habits")
    if (resourceResult.success) {
      const habitCreated: Habit = createHabitObject(
        habitName,
        habitDuration,
        habitCategory,
        habitDescription
      )
      console.log(habitCreated)
      // Create updated habits list
      const updatedHabits = [...habits, habitCreated]
      setHabits(updatedHabits) // Update state

      const result = await postHabit(habitCreated) // Save to DB

      if (result.success) {
        showToast("Habit created!", 200)
      } else {
        // Handling error from postHabit (if not success)
        showToast(result.message, result.status)
      }
      // Reset fields
      // Pass updated habits list to updateTheGoalData
      await updateTheGoalData(habitCreated, updatedHabits, false)
    } else {
      showToast("Limit Reached. upgrate plan!", resourceResult.status)
    }
    setIsDialogOpen(false)
    setHabitName("")
    setHabitDuration("")
    setHabitDescription("")
    setLinkedGoal("")
    setHabitCategory("")
    setDurationLocked(false)
    setCategoryLocked(false)
    setColorsLocked(false)
    setLoading(false)
  }

  const handleColorChange = (value: string) => {
    setHabitColor(value)
  }

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

  return (
    <section>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">Habit!</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
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
            <div className="flex justify-between">
              <div className="mt-4">
                <Select
                  value={habitDuration}
                  onValueChange={(value) => handleSetHabitDuration(value)}
                  disabled={durationLocked}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Habit Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="">
                      <SelectLabel>Habit Duration</SelectLabel>
                      {preDefinedHabitDurations.map((duration, i) => {
                        return (
                          <SelectItem key={i} value={duration.value.toString()}>
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
                  <SelectTrigger className="w-[150px] md:w-[180px]">
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
              <RadioGroup
                value={habitColor}
                onValueChange={handleColorChange}
                className="flex gap-4 flex-wrap justify-between"
              >
                {[
                  { color: "#f44336", border: "border-red-800" }, // Deeper Red
                  { color: "#e91e63", border: "border-pink-800" }, // Deeper Pink
                  { color: "#2196f3", border: "border-blue-800" }, // Deeper Blue
                  { color: "#388e3c", border: "border-green-800" }, // Deeper Green
                  { color: "#fb8c00", border: "border-orange-800" }, // Deeper Orange
                  { color: "#9c27b0", border: "border-purple-800" }, // Deeper Purple
                  { color: "#f57c00", border: "border-red-700" }, // Deeper Warm Peach
                  { color: "#afb42b", border: "border-yellow-800" }, // Deeper Yellow-Green
                  { color: "#607d8b", border: "border-gray-700" } // Deeper Gray
                ].map(({ color, border }) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem
                      id={color}
                      value={color}
                      className="hidden"
                      disabled={colorsLocked}
                    />
                    <label
                      htmlFor={color}
                      className={`h-6 w-6 cursor-pointer rounded-md transition-all duration-300
            ${
              habitColor === color
                ? `border-2 ${border} scale-110 shadow-lg`
                : "border border-gray-400 dark:border-gray-600"
            }
          `}
                      style={{ backgroundColor: color }} // ✅ This fixes the issue!
                    ></label>
                  </div>
                ))}
              </RadioGroup>
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
                        if(goal.status==="active")
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
              Add {loading && <Loader2 className=" animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
