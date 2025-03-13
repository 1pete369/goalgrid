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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Task } from "@/types/todayTodoFeatureTypes"
import { Loader2, Trash2 } from "lucide-react"
import React, { SetStateAction, useState } from "react"

type TaskCardPropsType = {
  task: Task
  handleDeleteTask: (taskId: string) => Promise<void>
  handleTaskToggle: (taskId: string, completedStatus: boolean) => Promise<void>
  deleteTaskLoading: boolean
}

const priorityColors: Record<string, string> = {
  "1": "bg-green-100 text-green-600", // Low
  "2": "bg-yellow-100 text-yellow-600", // Medium
  "3": "bg-orange-100 text-orange-600", // High
  "4": "bg-red-100 text-red-600" // Urgent
}

export default function TaskCard({
  task,
  handleDeleteTask,
  handleTaskToggle,
  deleteTaskLoading
}: TaskCardPropsType) {
  // const [isCompleted, setIsCompleted] = useState(task.isCompleted)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteTaskFunction = async (taskId: string) => {
    await handleDeleteTask(taskId)
    setIsDeleteDialogOpen(false)
  }

  const handleCheckboxChange = (taskId: string, completedStatus: boolean) => {
    // setIsCompleted(!isCompleted)
    handleTaskToggle(taskId, !completedStatus)
  }

  return (
    <Card className=" w-full md:w-[280px] flex flex-col gap-3 rounded-sm shadow-none">
      <CardHeader className="p-0 pt-2 px-3 m-0 flex flex-row justify-between w-full border-transparent border-2 border-r"  style={{borderRightColor: task.taskColor}}>
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center">
            <Checkbox
              id={task.id}
              onCheckedChange={() =>
                handleCheckboxChange(task.id, task.isCompleted)
              }
              checked={task.isCompleted === true ? true : false}
              className="h-6 w-6 rounded-full border-green-500 data-[state=checked]:bg-green-500 /data-[state=checked]:text-black"
            />
          </div>
          <div className={`flex flex-col w-full`}>
            <Label
              htmlFor={task.id}
              className={`text-small p-0 ${task.isCompleted && "line-through"}`}
            >
              {task.name}
            </Label>
            {/* <p className="text-sm text-neutral-500">{task.description}</p> */}
          </div>
        </div>
        <div className="flex gap-2 ml-2">
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
                  task!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() => handleDeleteTaskFunction(task.id)}
                  disabled={deleteTaskLoading} // Disable the button while loading
                >
                  {deleteTaskLoading ? (
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
        </div>
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-between p-0 px-3 mt-2">
        <div className="flex gap-2">
          <Badge className="py-0 ">{task.duration} Minutes</Badge>
          <Badge
            className={`py-0 ${priorityColors[task.priority]} hover:${
              priorityColors[task.priority]
            }`}
          >
            {["Low", "Medium", "High", "Urgent"][Number(task.priority) - 1]}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between p-0"></CardFooter>
    </Card>
  )
}
