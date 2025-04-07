"use client"

import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { CheckSquare, RefreshCcw, Target } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type AnalyticsData = {
  numberOfTodayTasks: number
  numberOfTodayCompletedTasks: number
  numberOfTodayPendingTasks: number
  todayTasksCompletionRate: number
  totalGoals: number
  completedGoals: number
  activeGoals: number
  goalsCompletionRate: string
  highestCurrentStreak: number
  activeHabitsToday: number
  completionHabitsRateToday: number
  completedHabitsTodayLength: number
  mostCompletedGoalData: {
    name: string
    category: string
    progress: {
      totalCompleted: number
      completionRate: number
    }
  }
}

export default function Page() {
  const { user } = useUserContext()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [statements, setStatements] = useState<string[]>([])

  function getGreeting(): string {
    const hour = new Date().getHours()
    return hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening"
  }

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/analytics/${user.uid}`)
        .then((res) => res.json())
        .then((data: AnalyticsData) => {
          console.log("Data", data)
          setAnalytics(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user])

  useEffect(() => {
    console.log("statements", statements)
  }, [statements])

  useEffect(() => {
    if (analytics) {
      setStatements(generateStatements(analytics))
    }
  }, [analytics])

  const generateStatements = (analytics: AnalyticsData): string[] => {
    // Provide fallback values for analytics properties
    const numberOfTodayTasks = analytics.numberOfTodayTasks ?? 0
    const numberOfTodayCompletedTasks =
      analytics.numberOfTodayCompletedTasks ?? 0
    const numberOfTodayPendingTasks = analytics.numberOfTodayPendingTasks ?? 0
    const completedGoals = analytics.completedGoals ?? 0
    const totalGoals = analytics.totalGoals ?? 0
    const goalsCompletionRate = analytics.goalsCompletionRate ?? "0"
    const activeHabitsToday = analytics.activeHabitsToday
    const completedHabitsTodayLength = analytics.completedHabitsTodayLength ?? 0
    const highestCurrentStreak = analytics.highestCurrentStreak ?? 0
    const completionHabitsRateToday = analytics.completionHabitsRateToday ?? 0
    const mostCompletedGoalName = analytics.mostCompletedGoalData?.name ?? ""
    const mostCompletedGoalCategory =
      analytics.mostCompletedGoalData?.category ?? ""

    return [
      numberOfTodayTasks
        ? `✅ You've completed ${numberOfTodayCompletedTasks} out of ${numberOfTodayTasks} tasks today! Keep pushing forward! 🚀`
        : "❌ No tasks today! Add tasks now to stay on track! 📅",

      numberOfTodayTasks
        ? numberOfTodayPendingTasks > 0
          ? `🕒 You have ${numberOfTodayPendingTasks} pending task(s). Stay focused and finish them! 💪`
          : "✅ All tasks for today are completed! Keep up the momentum! 🔥"
        : "⚡ No pending tasks since you haven't added any today! Plan ahead for a productive day! 📝",

      completedGoals
        ? `  You've completed ${completedGoals} goal(s) so far! Amazing work! 🎉`
        : "  No completed goals yet, but you're making progress! Keep going! 🚀",

      mostCompletedGoalName && mostCompletedGoalCategory
        ? `  Your most completed goal is "${mostCompletedGoalName}" in the "${mostCompletedGoalCategory}" category! Keep it up! 💪`
        : "  No most completed goal yet. Keep working on your goals!",

      totalGoals
        ? `  Total Goals: ${totalGoals} | Completion Rate: ${goalsCompletionRate}%`
        : "  No goals set yet. Define your goals to track progress! 🎯",

      activeHabitsToday > 0
        ? ` You've completed ${completedHabitsTodayLength} out of ${activeHabitsToday} habits today! Keep up the discipline! 🔥 Your longest streak is ${highestCurrentStreak} days! Keep the momentum going! 🏆`
        : " No active habits today! Start tracking habits for consistency!",

      completionHabitsRateToday
        ? ` Habit completion rate today: ${completionHabitsRateToday.toFixed(
            2
          )}% Stay consistent! 💯`
        : " No habit completion data yet. Stay consistent! 💯",
      "  Plan & add at least 3 tasks for today!",
      "  Break goals into smaller milestones!",
      "  Maintain your habit streak for another day!",
      parseInt(goalsCompletionRate) < 100
        ? ` Push past ${goalsCompletionRate}% goal completion rate!`
        : " Stay consistent and stay strong! 💪"
    ]
  }

  if (!user || loading || analytics === null) return <FullPageLoading />

  return (
    <div className="container bg-squares min-h-screen p-4 md:px-16 pt-20 space-y-4 mx-auto">
      <section>
        <h1>
          Hey, {getGreeting()} {user.personalInfo.name.split(" ")[0]}!
        </h1>
      </section>

      <section
        className="w-full bg-primary-800 text-white py-1.5 shadow-[4px_4px_black] 
      dark:shadow-[4px_4px_white] rounded-sm"
      >
        {Array.isArray(statements) && statements.length > 0 && (
          <TypeWriter statements={statements} />
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Goals Insights */}
        <Link href="/work/personal/analytics/goals">
          <Card
            className="shadow-[4px_4px_black] 
      dark:shadow-[4px_4px_white] rounded-sm bg-primary-800 dark:bg-primary-800 
      text-white border-none cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Goals Insights</span>
                <Target className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Track your goal progress and stay on top of your long-term
                objectives.
              </p>
              <div className="mt-2 text-lg font-bold">
                🔥 {analytics.activeGoals} Goals in Progress!
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Habits Insights */}
        <Link href="/work/personal/analytics/habits">
          <Card
            className="shadow-[4px_4px_black] 
      dark:shadow-[4px_4px_white] rounded-sm bg-primary-800 dark:bg-primary-800 
      text-white border-none cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Habits Insights</span>
                <RefreshCcw className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Analyze habit streaks, build consistency, and track missed days.
              </p>
              <div className="mt-2 text-lg font-bold">
                🔥 {analytics.activeHabitsToday} Habits in progress!
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Tasks Insights */}
        <Link href="/work/personal/analytics/tasks">
          <Card
            className="shadow-[4px_4px_black] 
      dark:shadow-[4px_4px_white] rounded-sm bg-primary-800 dark:bg-primary-800 
      text-white border-none cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Tasks Insights</span>
                <CheckSquare className="w-5 h-5 text-purple-200" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                View completed, pending, and overdue tasks at a glance.
              </p>
              <div className="mt-2 text-lg font-bold">
                ✅ {analytics.numberOfTodayTasks} Tasks in progress today!
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  )
}

const LETTER_DELAY = 0.025
const BOX_FADE_DURATION = 0.125

const FADE_DELAY = 5
const MAIN_FADE_DURATION = 5

const SWAP_DELAY_IN_MS = 5500

const TypeWriter = ({ statements }: { statements: string[] }) => {
  const [statementIndex, setStatementIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatementIndex((pv) => (pv + 1) % statements.length)
    }, SWAP_DELAY_IN_MS)

    console.log("intervalId", intervalId)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="my-4 pl-2">
      {statements[statementIndex].split("").map((l, i) => {
        return (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              delay: FADE_DELAY,
              duration: MAIN_FADE_DURATION,
              ease: "easeInOut"
            }}
            className="relative break-all"
            key={`${statementIndex}-${i}`}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: i * LETTER_DELAY,
                duration: 1
              }}
            >
              {l}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                delay: i * LETTER_DELAY,
                times: [0, 0.1, 1],
                duration: BOX_FADE_DURATION,
                ease: "easeInOut"
              }}
              className="absolute  bottom-[3px] left-[1px] right-0 top-[3px] bg-neutral-900"
            ></motion.span>
          </motion.span>
        )
      })}
    </div>
  )
}
