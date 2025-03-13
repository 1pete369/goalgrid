import {
  ChartColumnIncreasingIcon,
  TargetIcon,
  Trophy,
  Zap
} from "lucide-react"
import { BasicStats } from "./cards"
import {
  DailyTaskStat,
  DropOffData,
  PriorityAnalyticsData,
  TaskData,
  TaskDurationAnalytics,
  TaskDurationAnalyticsData,
  TimedAnalytics
} from "./insightsDataTypes"
import { formatDateOnDuration } from "@/utils/basics"
import { eachDayOfInterval, format } from "date-fns"

export function getOverAllStats(data: TaskData) {
  const overAllStats: BasicStats[] = [
    { label: "Total", data: data.numberOfTasks, icon: TargetIcon },
    { label: "Completed", data: data.numberOfCompletedTasks, icon: Trophy },
    { label: "Pending", data: data.numberOfPendingTasks, icon: Zap },
    {
      label: "Completion Rate",
      data: parseInt(data.totalCompletionRate),
      progress: true,
      icon: ChartColumnIncreasingIcon
    }
  ]
  return overAllStats
}

export function getTodayStats(data: TaskData) {
  const todayStats: BasicStats[] = [
    { label: "Total", data: data.numberOfTodayTasks, icon: TargetIcon },
    {
      label: "Completed",
      data: data.numberOfTodayCompletedTasks,
      icon: Trophy
    },
    { label: "Pending", data: data.numberOfTodayPendingTasks, icon: Zap },
    {
      label: "Completion Rate",
      data: parseInt(data.todayCompletionRate),
      progress: true,
      icon: ChartColumnIncreasingIcon
    }
  ]
  return todayStats
}

export function getPieData(data: TaskData) {
  const pieData = [
    { name: "Completed", value: data.numberOfCompletedTasks, fill: "#22C55E" }, // Green
    { name: "Active", value: data.numberOfPendingTasks, fill: "#3B82F6" }
  ]
  return pieData
}

export function getPriorityData(data: TaskData): PriorityAnalyticsData[] {
  const priorityLabels = ["low", "medium", "high", "urgent"]
  const priorityAnalytics = data.priorityAnalytics
  const formattedPriorityAnalytics: PriorityAnalyticsData[] =
    priorityAnalytics.map((item) => {
      return {
        priority: priorityLabels[parseInt(item._id) - 1],
        totalTasks: item.totalTasks,
        completedTasks: item.completedTasks,
        missedTasks: item.missedTasks
      }
    })

  console.log(formattedPriorityAnalytics)

  return formattedPriorityAnalytics || [] // ✅ Ensure it always returns an array
}

export function fillMissingDaysTaskDuration(
  data: TaskDurationAnalytics[]
): TaskDurationAnalyticsData[] {
  if (data.length === 0) return []

  const startDate = new Date(data[0]._id)
  const endDate = new Date(data[data.length - 1]._id)
  const dateMap = new Map(data.map((item) => [item._id, item]))

  const filledData: TaskDurationAnalyticsData[] = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0] // Format as YYYY-MM-DD
    filledData.push(
      dateMap.get(dateStr)
        ? {
            date: formatDateOnDuration(dateStr),
            averageDuration: dateMap.get(dateStr)!.averageDuration,
            totalDuration: dateMap.get(dateStr)!.totalDuration,
            completedDuration: dateMap.get(dateStr)!.completedDuration
          }
        : {
            date: formatDateOnDuration(dateStr),
            averageDuration: 0,
            totalDuration: 0,
            completedDuration: 0
          }
    )
  }

  return filledData
}

const fillMissingHours = (timedData: TimedAnalytics[]) => {
  const fullHours = Array.from({ length: 24 }, (_, i) => ({
    _id: i.toString().padStart(2, "0"), // Ensure "01", "02", etc.
    completedTasks: 0
  }))

  return fullHours.map(
    (hour) => timedData.find((d) => d._id === hour._id) || hour
  )
}

// Usage:
const convertToLocalHour = (utcHour: number) => {
  const date = new Date() // Create a fresh Date object
  date.setUTCHours(utcHour, 0, 0, 0) // Set UTC hour correctly
  return date.toLocaleTimeString([], { hour: "2-digit", hour12: true }) // Convert to local hour
}

export const getHourData = (data: TimedAnalytics[]) => {
  const chartData = fillMissingHours(data)

  console.log("Filled data", chartData)

  const hourData = chartData.map((oneHour) => ({
    originalUTC: oneHour._id, // Keep the original UTC hour for debugging
    hour: convertToLocalHour(parseInt(oneHour._id)), // Convert to local time
    completedTasks: oneHour.completedTasks
  }))

  // Sort the hourData based on the local hour (important for correct display)
  // hourData.sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

  console.log("Hour data (sorted)", hourData)

  return hourData
}

export const fillMissingDates = (data: DailyTaskStat[]) => {
  if (data.length === 0) return []

  const startDate = new Date(data[0].date)
  const endDate = new Date(data[data.length - 1].date)

  const allDates = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => format(date, "yyyy-MM-dd")
  )

  const dataMap = new Map(data.map((item) => [item.date, item]))

  return allDates.map(
    (date) => dataMap.get(date) || { date, totalTasks: 0, completedTasks: 0 }
  )
}

export const fillMissingDropOffDays = (data: DropOffData[]) => {
  // Create a map for quick lookup
  const dataMap = new Map(data.map((item) => [item._id, item.missedTasks]))

  // Generate all 7 days (1-7)
  const filledData = Array.from({ length: 7 }, (_, i) => ({
    _id: i + 1, // Keep 1-7 (Sunday-Saturday)
    missedTasks: dataMap.get(i + 1) ?? 0 // Default to 0 if missing
  }))

  return filledData
}
