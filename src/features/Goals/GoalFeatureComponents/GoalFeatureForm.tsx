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
import { getTodayDate } from "@/utils/basics"
import { postGoal } from "@/utils/goals"
import {
  validateGoalDescription,
  validateGoalName
} from "@/utils/validators/goalFormValidators"
import { Loader2, Plus } from "lucide-react"
import React, { ChangeEvent, useEffect, useState } from "react"
import {
  preDefinedGoalCategories,
  preDefinedGoalDurations
} from "./GoalFeatureConstants"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCustomToast } from "@/hooks/useCustomToast"
import { delay } from "@/utils/delay"
import { getResourceCount } from "@/utils/resource-limits"

type GoalFeatureFormPropsType = {
  setGoals: React.Dispatch<React.SetStateAction<[] | Goal[]>>
}

export default function GoalFeatureForm({
  setGoals
}: GoalFeatureFormPropsType) {
  const { user } = useUserContext()

  const [goalDuration, setGoalDuration] = useState("") // Default 30 days
  const [goalDeadline, setGoalDeadline] = useState("")
  const [goalColor, setGoalColor] = useState("")
  const [goalName, setGoalName] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalCategory, setGoalCategory] = useState("")
  const [goalNameError, setGoalNameError] = useState("")
  const [goalDescriptionError, setGoalDescriptionError] = useState("")
  const [canCreateGoal, setCanCreateGoal] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { showToast } = useCustomToast()
  const [loading, setLoading] = useState(false)

  const handleCreateGoal = async () => {
    setLoading(true)

    const resourceResult = await getResourceCount(user?.uid as string, "goals")
    if (resourceResult.success) {
      const goalCreated: Goal = createGoalObject(
        goalName,
        goalDescription,
        goalCategory
      )
      console.log(goalCreated)

      const result = await postGoal(goalCreated)

      if (result.success) {
        showToast("Goal created!", 200)
        setGoals((goals) => [...goals, goalCreated])
      } else {
        showToast(result.message, result.status)
      }
    } else {
      showToast("Limit Reached. upgrate plan!", resourceResult.status)
    }

    setGoalName("")
    setGoalDescription("")
    setGoalCategory("")
    setIsDialogOpen(false)
    setLoading(false)
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

  const handleDurationChange = (duration: string) => {
    const durationInDays = parseInt(duration, 10) // Convert string to number
    setGoalDuration(duration)
  
    // Start date is today
    const startDate = new Date()
  
    // Calculate the deadline correctly (21 days + 1)
    const deadlineDate = new Date(startDate)
    deadlineDate.setDate(startDate.getDate() + durationInDays) // No need to subtract 1 now
  
    console.log(deadlineDate)
  
    setGoalDeadline(deadlineDate.toISOString().split("T")[0]) // Format YYYY-MM-DD
  }
  

  const handleColorChange = (value: string) => {
    setGoalColor(value)
  }

  const createGoalObject = (
    goalName: string,
    goalDescription: string,
    goalCategory: string
  ) => {
    const goal: Goal = {
      id: crypto.randomUUID(),
      uid: user?.uid as string,
      name: goalName,
      description: goalDescription,
      createdAt: new Date(),
      goalColor: goalColor,
      category: goalCategory,
      deadline: goalDeadline,
      duration: goalDuration,
      habits: [],
      progress: {
        totalCompleted: 0,
        completionRate: 0
      },
      status: "active"
    }
    return goal
  }

  useEffect(() => {
    if (
      goalName !== "" &&
      goalDescription !== "" &&
      goalNameError === "" &&
      goalDescriptionError === "" &&
      goalCategory !== "" &&
      goalDuration !== ""
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
    goalCategory,
    goalDuration
  ])

  return (
    <section>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">new Goal!</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-4">
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
            <div className="flex justify-between ">
              <div className="mt-4">
                <Select
                  value={goalDuration}
                  onValueChange={(value) => handleDurationChange(value)}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Goal Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="">
                      <SelectLabel>Goal Duration</SelectLabel>
                      {preDefinedGoalDurations.map((duration, i) => {
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
                  value={goalCategory}
                  onValueChange={(value) => setGoalCategory(value)}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
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
            <div className="mt-4">
              <RadioGroup
                value={goalColor}
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
                    />
                    <label
                      htmlFor={color}
                      className={`h-6 w-6 cursor-pointer rounded-md transition-all duration-300
            ${
              goalColor === color
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
          </div>
          <DialogFooter>
            <Button
              disabled={!canCreateGoal || loading}
              type="submit"
              className="w-[200px] mx-auto"
              onClick={handleCreateGoal}
            >
              {loading ? (
                <p className="flex gap-1 items-center">
                  Adding <Loader2 className="animate-spin" />
                </p>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
