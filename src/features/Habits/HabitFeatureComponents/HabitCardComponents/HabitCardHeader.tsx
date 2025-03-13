"use client"

import { CardHeader } from "@/components/ui/card"
import { Habit } from "@/types/habitFeatureTypes"
import { EllipsisVertical, Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteHabit } from "@/utils/habits"
import { SetStateAction, useState } from "react"
import { Goal } from "@/types/goalFeatureTypes"
import { Button } from "@/components/ui/button"
import { useCustomToast } from "@/hooks/useCustomToast"

type HabitCardHeaderPropsType = {
  habit: Habit
  setHabits: React.Dispatch<SetStateAction<Habit[]>>
  updateTheGoalData: (
    habit: Habit,
    updatedHabits?: Habit[],
    isDeleted?: boolean
  ) => Promise<void>
  goals: Goal[]
}

export default function HabitCardHeader({
  habit,
  setHabits,
  updateTheGoalData,
  goals
}: HabitCardHeaderPropsType) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useCustomToast()

  const handleDeleteHabit = async (habit: Habit) => {
    setLoading(true)
    const habitId = habit.id
    const result = await deleteHabit(habitId)

    if (result.success) {
      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.id !== habitId)
      )
      const isDeleted = true
      await updateTheGoalData(habit, [], isDeleted)
      setLoading(false)
      setIsDeleteDialogOpen(false)
      showToast("Habit deleted!", 200)
    } else {
      showToast(result.message, result.status)
    }
  }

  function calculateElapsedDays(startDate: string, duration: string): string {
    const start = new Date(startDate)
    const today = new Date()

    // Calculate elapsed days since start
    let elapsedDays =
      Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
      1 // +1 to include the start date

    // Ensure it doesn't exceed the habit duration
    elapsedDays = Math.min(elapsedDays, parseInt(duration))

    return `${elapsedDays}/${duration} days`
  }

  return (
    <CardHeader
      className="relative flex flex-row py-1 px-4 justify-between items-center border-transparent border-r border-2"
      style={{ borderRightColor: habit.habitColor }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <span className="text-sm">{habit.streak.current}</span>
          <Image
            src={"/flame.png"}
            height={15}
            width={15}
            alt="streak"
            // className="h-5 w-5"
          />
        </div>
        {/* {habit.linkedGoal && (
        <div className="absolute right-4 top-2 text-xs text-gray-700 flex items-center gap-1">
          <span className="text-sm font-medium">Goal: </span>
          {goals.map((goal) => {
            if (habit.linkedGoal === goal.id) {
              return (
                <span
                  key={goal.id}
                  className="bg-blue-200 text-blue-600 rounded px-2 py-1"
                  >
                  {goal.name}
                  </span>
                  )
                  }
          })}
          </div>
          )} */}
        <div className="flex gap-2 items-center">
          <p className="text-sm dark:text-slate-400 underline">
            {calculateElapsedDays(habit.startDate, habit.duration)}
          </p>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger>
              {/* <Trash2 className=" text-black dark:text-white"/> */}
              <Trash2 size={14} className="text-black dark:text-slate-200" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  habit!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() => handleDeleteHabit(habit)}
                  disabled={loading} // Disable the button while loading
                >
                  {loading ? (
                    <p className="flex gap-1 items-center">
                      Deleting <Loader2 className="animate-spin" />
                    </p>
                  ) : (
                    "Continue"
                  )}{" "}
                  {/* Show loading text */}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger className=" focus:border-none focus-within:outline-none focus-within:border-none">
              <EllipsisVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              {Array.isArray(goals) && goals.length > 0 ? (
                goals.some((goal) => habit.linkedGoal === goal.id) ? (
                  goals.map((goal) =>
                    habit.linkedGoal === goal.id ? (
                      <DropdownMenuItem key={goal.id}>
                        Linked Goal: {goal.name}
                      </DropdownMenuItem>
                    ) : null
                  )
                ) : (
                  <DropdownMenuItem disabled>
                    No linked goals found
                  </DropdownMenuItem>
                )
              ) : (
                <DropdownMenuItem disabled>No goals available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Linked Goal Icon */}
      {/* {habit.linkedGoal !== "" && (
        <Image
        src={"/goalLink.png"}
        sizes="10"
        width={25}
        height={25}
          className="absolute -top-5 -right-3"
          alt="linkedGoal"
        />
      )} */}
    </CardHeader>
  )
}
