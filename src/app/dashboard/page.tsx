"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts"
import { getTasks } from "@/utils/todayTasks"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Task } from "@/types/todayTodoFeatureTypes"

type AnalyticsData= {
  totalTasks: number
  completedTasks: number
  completionRate: number
  dailyCompletion: Record<string, { total: number; completed: number }>
  categoryStats: Record<string, { total: number; completed: number }>
  bestDay: { date: string | null; rate: number }
}

const AnalyticsDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const { user } = useUserContext()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    if (user !== null) {
      const fetchData = async () => {
        const tasks = await getTasks(user?.uid as string)
        setTasks(tasks)
        setAnalytics(processAnalytics(tasks))
      }
      fetchData()
    }
  }, [user])

  const processAnalytics = (todos: Task[]): AnalyticsData => {
    let dailyCompletion: Record<string, { total: number; completed: number }> = {}
    let categoryStats: Record<string, { total: number; completed: number }> = {}
    let completedTasks = 0
    let totalTasks = todos.length

    todos.forEach((task) => {
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0]

      // Daily Completion
      if (!dailyCompletion[taskDate])
        dailyCompletion[taskDate] = { total: 0, completed: 0 }
      dailyCompletion[taskDate].total += 1
      if (task.isCompleted) {
        dailyCompletion[taskDate].completed += 1
        completedTasks++
      }

      // Category Stats
      if (!categoryStats[task.category])
        categoryStats[task.category] = { total: 0, completed: 0 }
      categoryStats[task.category].total += 1
      if (task.isCompleted) categoryStats[task.category].completed += 1
    })

    // Best Productivity Day
    let bestDay = Object.keys(dailyCompletion).reduce<{
      date: string | null
      rate: number
    }>(
      (best, date) => {
        let rate =
          (dailyCompletion[date].completed / dailyCompletion[date].total) * 100
        return rate > best.rate ? { date: date, rate } : best
      },
      { date: null, rate: 0 }
    )

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      dailyCompletion,
      categoryStats,
      bestDay
    }
  }

  if (!analytics) return <p className="text-center text-lg">Loading analytics...</p>

  // Convert analytics data to chart format
  const dailyCompletionData = Object.keys(analytics.dailyCompletion).map(
    (date) => ({
      date,
      completion:
        (analytics.dailyCompletion[date].completed /
          analytics.dailyCompletion[date].total) *
        100
    })
  )

  const categoryData = Object.keys(analytics.categoryStats).map((category) => ({
    name: category,
    completed: analytics.categoryStats[category].completed,
    total: analytics.categoryStats[category].total
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="md:px-16 px-4 pt-20">
      <h2 className="text-2xl font-semibold text-center">📊 To-Do List Analytics</h2>

      <div className="text-center mt-4 space-y-2">
        <p className="text-lg">✅ Total Tasks: <span className="font-medium">{analytics.totalTasks}</span></p>
        <p className="text-lg">✔️ Completed Tasks: <span className="font-medium">{analytics.completedTasks}</span></p>
        <p className="text-lg">📈 Completion Rate: <span className="font-medium">{analytics.completionRate.toFixed(2)}%</span></p>
        <p className="text-lg">🏆 Best Productivity Day: <span className="font-medium">{analytics.bestDay.date}</span> ({analytics.bestDay.rate.toFixed(2)}%)</p>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
        {/* Daily Completion Bar Chart */}
        <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-medium text-center mb-2">📅 Daily Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyCompletionData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completion" fill="#8884d8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-medium text-center mb-2">📌 Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="completed"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard



