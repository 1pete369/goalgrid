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
import { useCustomToast } from "@/hooks/useCustomToast"
import { Task } from "@/types/todayTodoFeatureTypes"
import { postTask } from "@/utils/todayTasks"
import { Loader2, Plus } from "lucide-react"
import React, { ChangeEvent, useEffect, useState } from "react"
import {
  preDefinedTaskCategories,
  preDefinedTaskDurations,
  preDefinedTaskPriorities
} from "./TodayTodoListConstants"
import { getResourceCount } from "@/utils/resource-limits"

type TodayTaskListFeatureFormPropsType = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<[] | Task[]>>
}

export default function TodayTaskListFeatureForm({
  setTasks,
  tasks
}: TodayTaskListFeatureFormPropsType) {
  const { user } = useUserContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [canAddTask, setCanAddTask] = useState(false)

  const [taskName, setTaskName] = useState("")
  const [taskNameError, setTaskNameError] = useState("")

  const [taskDescription, setTaskDescription] = useState("")

  const [taskPriority, setTaskPriority] = useState("")

  const [taskDuration, setTaskDuration] = useState("")

  const [taskColor, setTaskColor] = useState("")

  const [taskCategory, setTaskCategory] = useState("")
  const { showToast } = useCustomToast()
  const [loading, setLoading] = useState(false)
  //   const [taskDueDate,setTaskDueDate] = useState("")

  const createTaskObject = () => {
    if (user !== null) {
      const task: Task = {
        id: crypto.randomUUID(),
        uid: user?.uid,
        name: taskName,
        description: taskDescription,
        priority: taskPriority as "1" | "2" | "3" | "4",
        duration: taskDuration,
        category: taskCategory,
        isCompleted: false,
        taskColor: taskColor,
        createdAt: new Date() // ✅ Use Date object instead of string
      }
      return task
    }
  }

  const handleAddNewTask = async () => {
    setLoading(true)
    const resourceResult = await getResourceCount(user?.uid as string, "tasks")
    if (resourceResult.success) {
      const taskObject: Task | undefined = createTaskObject()

      console.log("taskObject", taskObject)
      if (!taskObject) {
        console.error("Error: Task object is undefined")
        return
      }

      const result = await postTask(taskObject)
      if (result.success) {
        const updatedTasks = [...tasks, taskObject]
        // localStorage.setItem("tasks",JSON.stringify(updatedTasks))
        setTasks(updatedTasks)
        showToast("Task added!", 200)
      } else {
        showToast(result.message, result.status)
      }
    } else {
      showToast("Limit Reached. upgrate plan!", resourceResult.status)
    }
    setIsDialogOpen(false)
    setTaskName("")
    setTaskNameError("")
    setTaskCategory("")
    setTaskDescription("")
    setCanAddTask(false)
    setTaskDuration("")
    setTaskPriority("")
    setTaskColor("")
    setLoading(false)
  }

  const handleTaskName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const name = e.target.value.trim()
    setTaskName(name)
    if (name.trim() === "") {
      setTaskNameError("Enter task name")
    } else {
      setTaskNameError("")
    }
  }
  const handleTaskDescription = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const description = e.target.value.trim()
    setTaskDescription(description)
  }

  const handleTaskPriority = (value: string) => {
    setTaskPriority(value)
  }
  const handleTaskDuration = (value: string) => {
    setTaskDuration(value)
  }
  const handleTaskCategory = (value: string) => {
    setTaskCategory(value)
  }

  const handleTaskColor = (value: string) => {
    setTaskColor(value)
  }

  useEffect(() => {
    if (
      taskName !== "" &&
      taskDuration !== "" &&
      taskNameError === "" &&
      taskPriority !== "" &&
      // taskColor !== "" &&
      taskCategory !== ""
    ) {
      setCanAddTask(true)
    } else {
      setCanAddTask(false)
    }
  }, [taskCategory, taskName, taskDuration, taskPriority, taskColor])

  return (
    <section>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">new Task!</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-4">
          <DialogHeader>
            <DialogTitle>Add new Task!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) => handleTaskName(e)}
              />
              {taskNameError !== "" && (
                <p className="text-error text-sm">{taskNameError}</p>
              )}
            </div>
         
            <div className="flex items-center justify-between">
              <div className="mt-4">
                <Select
                  value={taskCategory}
                  onValueChange={(value) => handleTaskCategory(value)}
                  //   disabled={categoryLocked}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Task Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="">
                      <SelectLabel>Task Category</SelectLabel>
                      {preDefinedTaskCategories.map((category) => {
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
              <div className="mt-4">
                <Select
                  value={taskDuration}
                  onValueChange={(value) => handleTaskDuration(value)}
                  //   disabled={durationLocked}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Task Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="">
                      <SelectLabel>Task Duration</SelectLabel>
                      {preDefinedTaskDurations.map((duration, i) => {
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
            </div>

            {/* <div className="mt-4">
              <RadioGroup
                value={taskColor}
                onValueChange={handleTaskColor}
                className="flex gap-4 flex-wrap justify-between"
              >
                {[
                  { color: "#ffebee", border: "border-red-600" }, // Soft Pinkish Red
                  { color: "#fce4ec", border: "border-pink-600" }, // Pastel Pink
                  { color: "#e3f2fd", border: "border-blue-600" }, // Light Sky Blue
                  { color: "#e8f5e9", border: "border-green-600" }, // Soft Mint Green
                  { color: "#fff3e0", border: "border-orange-600" }, // Light Orange
                  { color: "#ede7f6", border: "border-purple-600" }, // Light Lavender
                  { color: "#ffccbc", border: "border-red-500" }, // Warm Peach
                  { color: "#f0f4c3", border: "border-yellow-600" }, // Soft Yellow-Green
                  { color: "#cfd8dc", border: "border-gray-600" } // Neutral Gray
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
              taskColor === color
                ? `border-2 ${border} scale-110 shadow-lg`
                : "border border-gray-400 dark:border-gray-600"
            }
          `}
                      style={{ backgroundColor: color }} // ✅ This fixes the issue!
                    ></label>
                  </div>
                ))}
              </RadioGroup>
            </div> */}
          </div>
          <div className="flex items-center gap-4">
              {/* <div className="w-full">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className=" w-full"
                  onChange={(e) => handleTaskDescription(e)}
                />
              </div> */}
              <div className="">
                <Select
                  value={taskPriority}
                  onValueChange={(value) => handleTaskPriority(value)}
                  //   disabled={categoryLocked}
                >
                  <SelectTrigger className="w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Task Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="">
                      <SelectLabel>Task Priority</SelectLabel>
                      {preDefinedTaskPriorities.map((priority, i) => {
                        return (
                          <SelectItem key={i} value={priority.value.toString()}>
                            {priority.label}
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
              disabled={!canAddTask || loading}
              type="submit"
              className="w-[200px] mx-auto"
              onClick={handleAddNewTask}
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
