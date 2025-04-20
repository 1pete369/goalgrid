import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Task } from "@/types/todayTodoFeatureTypes"
import { deleteTask, getTasks, toggleTask } from "@/utils/todayTasks"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Clock,
  EllipsisVertical
} from "lucide-react"
import { useEffect, useState } from "react"
import TaskCard from "./TodayTodoListComponents/TaskCard"
import TodayTodoListFeatureForm from "./TodayTodoListComponents/TodayTodoListFeatureForm"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCustomToast } from "@/hooks/useCustomToast"
import TodayTaskSkeleton from "@/skeletons/TodayTaskSkeleton"
import TasksTimeLine from "./TasksTimeLine"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"

export default function TodayTodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [sortBy, setSortBy] = useState<
    "createdAt" | "priority" | "duration" | "completed"
  >("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Default: Newest First
  const [groupByCategory, setGroupByCategory] = useState(true) // ✅ Feature flag toggle

  const [loading, setLoading] = useState(false)
  const [deleteTaskLoading, setDeleteTastLoading] = useState(false)

  const { user } = useUserContext()
  const { showToast } = useCustomToast()

  const [activateTimeLine, setActivateTimeLine] = useState(false)

  const handleDeleteTask = async (taskId: string) => {
    setDeleteTastLoading(true)
    const result = await deleteTask(taskId)
    if (result.success) {
      showToast("Task Deleted", 200)
      setTasks(tasks.filter((task) => task.id !== taskId))
    } else {
      showToast(result.message, result.status)
    }
    setDeleteTastLoading(false)
  }

  const handleTaskToggle = async (taskId: string, completedStatus: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: completedStatus } : task
      )
    )
    await toggleTask(taskId, completedStatus)
  }

  useEffect(() => {
    if (user !== null) {
      async function fetchTasks() {
        setLoading(true)
        const result = await getTasks(user?.uid as string)
        if (result.success) {
          const tasks = result.data
          setTasks(tasks)
        } else {
          showToast(result.message, result.status)
        }
        setLoading(false)
      }
      fetchTasks()
    }
  }, [user])

  // ✅ Sorting Function with Order Toggle
  const sortTasks = (
    tasks: Task[],
    criteria: "createdAt" | "priority" | "duration" | "completed",
    order: "asc" | "desc"
  ) => {
    return [...tasks].sort((a, b) => {
      let result = 0

      if (criteria === "createdAt") {
        result =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() // Oldest first
      }
      if (criteria === "priority") {
        result = parseInt(a.priority) - parseInt(b.priority) // Lowest priority first
      }
      if (criteria === "duration") {
        result = parseInt(a.duration) - parseInt(b.duration) // Shortest duration first
      }
      if (criteria === "completed") {
        result = a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1 // Uncompleted first
      }
      return order === "asc" ? result : -result // Reverse if order is 'desc'
    })
  }

  const sortedTasks = sortTasks(tasks, sortBy, sortOrder)

  // ✅ Then, Group the Already Sorted Tasks
  // ✅ Step 1: Group tasks by category first
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  // ✅ Step 2: Sort tasks within each category (WITHOUT changing category order)
  Object.keys(groupedTasks).forEach((category) => {
    groupedTasks[category] = sortTasks(
      groupedTasks[category],
      sortBy,
      sortOrder
    )
  })

  if (user === null) return <FullPageLoading />

  // ✅ Function to Toggle Sort Order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="container min-h-[calc(100vh-64px)] md:px-16 p-4 mx-auto">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <div className="w-full flex gap-2 items-center justify-between">
          <Greetings feature="todo" />
          {/* <div className="flex items-center gap-2">
            <Switch
              id="flag"
              checked={groupByCategory}
              onCheckedChange={setGroupByCategory}
            />
            <label className="text-sm font-medium" htmlFor="flag">
              Time line
            </label>
          </div> */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* <Switch
                  id="timeline"
                  checked={activateTimeLine}
                  onCheckedChange={() => setActivateTimeLine((prev) => !prev)}
                  className="data-[state=checked]:bg-primary-500"
                /> */}
                <Toggle
                  pressed={activateTimeLine}
                  onPressedChange={() => setActivateTimeLine((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-800 data-[state=on]:bg-primary-800 border-2 border-primary-500 data-[state=on]:text-white hover:bg-transparent hover:text-black "
                >
                  <Clock
                    className={`w-4 h-4 transition-all  ${
                      activateTimeLine ? "text-white" : "text-black"
                    }`}
                  />
                  Timeline
                </Toggle>
              </div>

            </div>

            {process.env.NEXT_PUBLIC_TASKS_FILTER === "true" && (
              <div className="hidden lg:flex items-center gap-4">
                {/* Sorting Criteria */}
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger className="p-2 py-4 border rounded w-[200px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      <SelectItem value="createdAt">Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* Toggle Sort Order */}
                <Button onClick={toggleSortOrder} variant="outline">
                  {sortOrder === "asc" ? (
                    <ArrowUpIcon className="w-5 h-5" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <TodayTodoListFeatureForm setTasks={setTasks} tasks={tasks} />
          {process.env.NEXT_PUBLIC_TASKS_FILTER === "true" && (
            <DropdownMenu>
              <DropdownMenuTrigger className="lg:hidden">
                <EllipsisVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <DropdownMenuLabel>Sorting</DropdownMenuLabel>
                <div className="flex items-center gap-4">
                  {/* Sorting Criteria */}
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as any)}
                  >
                    <SelectTrigger className="p-2 py-4 border rounded w-[200px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sort By</SelectLabel>
                        <SelectItem value="createdAt">Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* Toggle Sort Order */}
                  <Button onClick={toggleSortOrder} variant="outline">
                    {sortOrder === "asc" ? (
                      <ArrowUpIcon className="w-5 h-5" />
                    ) : (
                      <ArrowDownIcon className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {loading ? (
        <TodayTaskSkeleton />
      ) : activateTimeLine ? (
        <TasksTimeLine Tasks={tasks} />
      ) : (
        <section className="mt-4 space-y-6">
          {groupByCategory ? (
            // ✅ Grouped View
            Object.entries(groupedTasks).length > 0 ? (
              Object.entries(groupedTasks).map(([category, tasks]) => (
                <div key={category}>
                  {/* ✅ Category Name */}
                  <h2 className="text-base font-semibold mb-2">{category}</h2>

                  {/* ✅ Tasks Under Each Category */}
                  <div className="flex flex-wrap gap-4">
                    {tasks.map((task, i) => (
                      <TaskCard
                        key={i}
                        task={task}
                        handleTaskToggle={handleTaskToggle}
                        handleDeleteTask={handleDeleteTask}
                        deleteTaskLoading={deleteTaskLoading}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks created</p>
            )
          ) : (
            // ✅ List View (Flat List)
            <div className="flex flex-wrap gap-4">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    handleTaskToggle={handleTaskToggle}
                    handleDeleteTask={handleDeleteTask}
                    deleteTaskLoading={deleteTaskLoading}
                  />
                ))
              ) : (
                <p>No tasks created</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
