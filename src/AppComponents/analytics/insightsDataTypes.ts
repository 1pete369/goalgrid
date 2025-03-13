export type DailyTaskStat = {
  date: string
  totalTasks: number
  completedTasks: number
}

export type DropOffData = {
  _id: number
  missedTasks: number
}

export type TimedAnalytics = {
  _id: string
  completedTasks: number
}

export type TimedAnalyticsData = {
  hour: string
  completedTasks: number
}

export type PriorityAnalytics = {
  _id: string
  totalTasks: number
  completedTasks: number
  missedTasks: number
}

export type PriorityAnalyticsData = {
  priority: string
  totalTasks: number
  completedTasks: number
  missedTasks: number
}

export type TaskDurationAnalytics = {
  _id: string
  averageDuration: number
  totalDuration: number
  completedDuration: number
}
export type TaskDurationAnalyticsData = {
  date: string
  averageDuration: number
  totalDuration: number
  completedDuration: number
}

export type TaskData = {
  numberOfTasks: number
  numberOfCompletedTasks: number
  numberOfPendingTasks: number
  numberOfTodayTasks: number
  numberOfTodayCompletedTasks: number
  numberOfTodayPendingTasks: number
  totalCompletionRate: string
  todayCompletionRate: string
  dailyTaskStats: DailyTaskStat[]
  dropOffData: DropOffData[]
  timedData: TimedAnalytics[]
  currentStreak: number
  bestStreak: number
  priorityAnalytics: PriorityAnalytics[]
  overallTaskDurationAnalytics: TaskDurationAnalytics[]
}
