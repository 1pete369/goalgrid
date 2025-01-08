export type Habit = {
  uid : string,
  id: string
  name: string
  description?: string
  category: string
  startDate: string
  duration: string
  streak: {
    current: number
    best: number
  }
  progress: {
    totalCompleted: number
    completionRate: number
  }
  dailyTracking: {
    [date: string] : boolean
  }
  status: "active" | "completed"
  linkedGoal ?: string
}
