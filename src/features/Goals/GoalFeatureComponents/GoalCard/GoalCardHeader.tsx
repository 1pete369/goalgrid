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
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import { useCustomToast } from "@/hooks/useCustomToast"
import { Goal } from "@/types/goalFeatureTypes"
import { Habit } from "@/types/habitFeatureTypes"
import { formatDate, subtractOneDay } from "@/utils/basics"
import { deleteGoal } from "@/utils/goals"
import { ArrowRight, Calendar, Loader2, Trash2 } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

type GoalCardHeaderPropsType = {
  goal: Goal
  setGoals: Dispatch<SetStateAction<[] | Goal[]>>
}

export default function GoalCardHeader({
  goal,
  setGoals
}: GoalCardHeaderPropsType) {
  const [isLoading, setIsLoading] = useState(false) // Track loading state
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Track whether the dialog is open

  const {showToast} = useCustomToast()

  function getDeadlineColor(deadline: string): string {
    const today = new Date()
    const dueDate = new Date(deadline)

    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    const timeDiff = dueDate.getTime() - today.getTime()
    const daysRemaining = timeDiff / (1000 * 60 * 60 * 24)

    if (daysRemaining < 0) {
      return "text-red-500 dark:text-red-300"
    } else if (daysRemaining <= 3) {
      return "text-orange-500 dark:text-orange-300"
    } else {
      return "text-gray-600 dark:text-gray-400"
    }
  }

  const handleDelete = async (deletingGoal: Goal) => {
    setIsLoading(true) // Start loading
    console.log(goal)
    const linkedHabits = goal.habits.map((habit: Habit) => habit.id)
    console.log("LinkedHabits", linkedHabits)

    const result= await deleteGoal(deletingGoal.id, linkedHabits)
    if(result.success){
      showToast("Goal Deleted along with linked habits!",200)
      setGoals((goals) => goals.filter((goal) => goal.id !== deletingGoal.id))
    }else{
      showToast(result.message,result.status)
    }
      // Show success toast after deletion
      setIsLoading(false) // Stop loading
      setIsDialogOpen(false) // Close the dialog once done
  }

  return (
    <CardHeader
      className="flex flex-row items-center justify-between p-4 border-2 border-transparent"
      style={{ borderRightColor: goal.goalColor }}
    >
      <div className=" mt-1.5 flex items-center justify-between gap-1">
        <span className="flex text-sm items-center gap-1 text-slate-600 dark:text-slate-400 ">
          <Calendar size={14} />
          <p>{formatDate(goal.createdAt)}</p>
        </span>
        <ArrowRight size={14} className="text-slate-600 dark:text-slate-400" />
        <span
          className={`flex text-sm items-center gap-1 ${getDeadlineColor(
            goal.deadline
          )}`}
        >
          <Calendar size={14} />
          <p>{formatDate(subtractOneDay(goal.deadline))}</p>
        </span>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {" "}
        {/* Control dialog open state */}
        <AlertDialogTrigger>
          <Trash2 size={14} className="text-black dark:text-slate-200" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              goal and all the habits linked to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => handleDelete(goal)}
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? <p className="flex gap-1 items-center">Deleting <Loader2 className="animate-spin"/></p>: "Continue"} {/* Show loading text */}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardHeader>
  )
}
