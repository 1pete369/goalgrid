export type Task = {
  id: string
  uid : string
  name: string
  description: string
  duration: string
  priority: "1" | "2" | "3" | "4"
  category: string
  isCompleted: boolean
  createdAt: Date
  taskColor : string
}

export type TaskPriority = { priority: "1" | "2" | "3" | "4" }
