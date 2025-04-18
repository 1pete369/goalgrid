import React from "react"
import { format, parse } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type Task = {
  id: string
  uid: string
  name: string
  description: string
  startTime: string
  duration: string
  priority: "1" | "2" | "3" | "4"
  category: string
  isCompleted: boolean
  createdAt: Date
  taskColor: string
}

const priorityColors: Record<string, string> = {
  "1": "bg-green-100 text-green-600", // Low
  "2": "bg-yellow-100 text-yellow-600", // Medium
  "3": "bg-orange-100 text-orange-600", // High
  "4": "bg-red-100 text-red-600" // Urgent
}

const getTaskStatus = (startTime: string, duration: string) => {
  const now = new Date()
  const taskStart = parse(startTime, "HH:mm", new Date())
  const taskDuration = parseInt(duration) || 30 // Default duration 30 min
  const taskEnd = new Date(taskStart.getTime() + taskDuration * 60000)

  if (now < taskStart) return "upcoming"
  if (now >= taskStart && now <= taskEnd) return "current"
  return "completed"
}

export default function TasksTimeLine({ Tasks }: { Tasks: Task[] }) {
  const today = format(new Date(), "yyyy-MM-dd")
  const todayTasks = Tasks.filter(
    (task) => format(new Date(task.createdAt), "yyyy-MM-dd") === today
  ).sort((a, b) => (a.startTime > b.startTime ? 1 : -1))

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mt-4">
        Tasks for {format(new Date(), "E, MMM d, yyyy")}
      </h2>
      <div className="flex flex-wrap gap-4 py-2 text-sm">
        <span className="flex items-center gap-2">
          <p
            className="h-5 w-5 rounded-full border-4 bg-white dark:bg-black"
            style={{ borderColor: "#9CA3AF" }}
          ></p>
          Time completed
        </span>
        <span className="flex items-center gap-2">
          <p
            className="h-5 w-5 rounded-full border-4 bg-white dark:bg-black"
            style={{ borderColor: "#3B82F6" }}
          ></p>{" "}
          Ongoing
        </span>
        <span className="flex items-center gap-2">
          <p
            className="h-5 w-5 rounded-full border-4 bg-white dark:bg-black"
            style={{ borderColor: "#10B981" }}
          ></p>{" "}
          Upcoming
        </span>
      </div>
      <div className="relative mt-2 border-l-4 border-gray-300 dark:border-gray-700 space-y-4 ml-2">
        {todayTasks.map((task, index) => {
          const taskStart = parse(task.startTime, "HH:mm", new Date())
          const status = getTaskStatus(task.startTime, task.duration)
          const borderColor =
            status === "completed"
              ? "#9CA3AF" // Grey for past tasks
              : status === "current"
              ? "#3B82F6" // Blue for active task
              : "#10B981" // Green for upcoming tasks

          return (
            <div key={task.id} className="relative flex items-start">
              <div
                className="absolute h-5 w-5 rounded-full top-1/2 -translate-y-1/2 -left-3 border-4 bg-white dark:bg-black"
                style={{ borderColor }}
              ></div>
              <div
                className="bg-white dark:bg-slate-800/70 p-5 rounded-sm ml-6 w-full border-l-4 border-2"
                style={{ borderColor }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">
                    {format(taskStart, "hh:mm a")}
                  </span>
                  <div className="flex gap-4">
                    <Badge
                      className={`${
                        task.isCompleted
                          ? "bg-green-200 text-green-700 hover:bg-green-300"
                          : "bg-red-200 text-red-700 hover:bg-red-300"
                      }`}
                    >
                      {task.isCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mt-1">
                  {task.name}
                </h3>
                <div className="flex gap-4 mt-2">
                  <Badge>{task.duration} minutes</Badge>
                  <Badge
                    className={`${priorityColors[task.priority]} hover:${
                      priorityColors[task.priority]
                    }`}
                  >
                    {
                      ["Low", "Medium", "High", "Urgent"][
                        Number(task.priority) - 1
                      ]
                    }
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
