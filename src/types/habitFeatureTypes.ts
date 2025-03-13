export type Habit = {
  uid : string,
  id: string
  name: string
  description?: string
  category: string
  startDate: string
  endDate: string
  duration: string
  habitColor:string
  createdAt : Date
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
