"use client"

import {
  AdvancedStatsCard,
  AdvanceStats,
  BasicStats,
  BasicStatsCard
} from "@/AppComponents/analytics/cards"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Tooltip } from "@/components/ui/tooltip"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { formatDateOnDuration } from "@/utils/basics"
import {
  ArrowLeft,
  ArrowRight,
  ChartColumnIncreasingIcon,
  FlameIcon,
  LucideIcon,
  Target,
  TargetIcon,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts"

type AnalyticsData = {
  totalHabits: number
  completedHabits: number
  activeHabits: number
  completionRate: number
  highestCurrentStreak: number
  highestCurrentStreakHabitName: string
  highestBestStreak: number
  highestBestStreakHabitName: string
  mostCompletedHabitName: string
  mostCompletedHabitCount: number
  mostMissedHabitName: string
  mostMissedHabitCount: number
  dailyCompletion: Record<string, { completed: number; totalActive: number }>
}

export default function HabitDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [completionArray, setCompletionArray] = useState<
    { date: string; completed: number; total: number }[]
  >([])
  const [startIndex, setStartIndex] = useState(0)

  const { user } = useUserContext()

  useEffect(() => {
    if (user !== null) {
      const getAnalytics = async () => {
        try {
          const res = await fetch(
            `http://localhost:3001/habits/analytics/${user.uid}`
          )
          const data = await res.json()
          setData(data)
        } catch (error) {
          console.error("Error fetching analytics:", error)
        }
      }
      getAnalytics()
    }
  }, [user]) // Dependencies should be empty unless needed

  const sortedCompletion = useMemo(() => {
    if (!data?.dailyCompletion) return []

    return Object.entries(data.dailyCompletion)
      .map(([date, stats]) => ({
        date: formatDateOnDuration(date),
        completed: stats.completed,
        total: stats.totalActive
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data])

  useEffect(() => {
    setCompletionArray(sortedCompletion)
    setStartIndex(Math.max(0, sortedCompletion.length - 7)) // Ensure last 7 days are shown
  }, [sortedCompletion, setCompletionArray, setStartIndex]) // Use s

  const moveBackward = () => {
    setStartIndex((prev) => Math.max(0, prev - 7)) // Move back 7 days
  }

  const moveForward = () => {
    setStartIndex((prev) => Math.min(completionArray.length - 7, prev + 7)) // Move forward 7 days but never show less than 7 days
  }

  const getCurrentWeek = () => {
    return completionArray.slice(startIndex, startIndex + 7)
  }

  if (!data) return <p>Loading...</p>

  const pieData = [
    { name: "Completed", value: data.completedHabits, fill: "#22C55E" }, // Green
    { name: "Active", value: data.activeHabits, fill: "#3B82F6" } // Blue
  ]

  const pieChartConfig = {
    completed: {
      label: "Completed",
      color: "#22C55E" // Tailwind Green-500
    },
    active: {
      label: "Active",
      color: "#3B82F6" // Tailwind Blue-500
    },
    abandoned: {
      label: "Abandoned",
      color: "#EF4444" // Tailwind Red-500
    }
  }

  const basicStats: BasicStats[] = [
    {
      label: "Total",
      data: data.totalHabits,
      icon: Target
    },
    {
      label: "Completed",
      data: data.completedHabits,
      icon: Trophy
    },
    {
      label: "Active",
      data: data.activeHabits,
      icon: Zap
    },
    {
      label: "Completion Rate",
      data: data.completionRate,
      progress: true,
      icon: ChartColumnIncreasingIcon
    }
  ]

  const advanceStats: AdvanceStats[] = [
    {
      title: "Most completed habit",
      label: data.mostCompletedHabitName,
      sublabel: `completed ${data.mostCompletedHabitCount} times`,
      icon: TrendingUp
    },
    {
      title: "Most missed habit",
      label: data.mostMissedHabitName,
      sublabel: `missed ${data.mostMissedHabitCount} times`,
      icon: TrendingDown
    },
    {
      title: "Best streak habit",
      label: `${data.highestBestStreak} days`,
      sublabel: data.highestBestStreakHabitName,
      icon: FlameIcon
    },
    {
      title: "Current highest streak habit",
      label: `${data.highestCurrentStreak} days`,
      sublabel: data.highestCurrentStreakHabitName,
      icon: FlameIcon
    }
  ]

  const barChartConfig = {
    completed: {
      label: "Completed",
      color: "#22C55E"
    },
    total: {
      label: "Total Active",
      color: "#3B82F6"
    }
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="container min-h-screen p-4 md:px-16 pt-20 space-y-4 mx-auto">
      <h2 className="text-xl font-bold mb-4">📊 Habit Analytics</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {basicStats.map((basicStat) => {
          return (
            <BasicStatsCard
              key={basicStat.label}
              data={basicStat.data}
              label={basicStat.label}
              progress={basicStat.progress}
              icon={basicStat.icon}
            />
          )
        })}
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {advanceStats.map((advanceStat) => (
          <AdvancedStatsCard
            key={advanceStat.title}
            label={advanceStat.label}
            sublabel={advanceStat.sublabel}
            icon={advanceStat.icon}
            title={advanceStat.title}
          />
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Total Habits vs Completed
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={moveBackward}
                disabled={startIndex === 0}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="outline"
                onClick={moveForward}
                disabled={startIndex + 7 >= completionArray.length}
              >
                <ArrowRight />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart accessibilityLayer data={getCurrentWeek()}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" />
                <YAxis dataKey="total" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="total"
                  fill={barChartConfig.total.color}
                  isAnimationActive={true}
                  radius={4}
                />
                <Bar
                  dataKey="completed"
                  fill={barChartConfig.completed.color}
                  isAnimationActive={true}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="">
            <CardTitle>Pie Chart - Label</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  label
                  nameKey="name"
                  isAnimationActive={true}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry: any, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: entry.fill }}
                  ></div>
                  {entry.name}
                </div>
              ))}
            </div>
            <div className="leading-none text-muted-foreground">
              Showing Data from first habit!
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

// export function BasicStatsCard({
//   data,
//   label,
//   progress,
//   icon: Icon
// }:BasicStats ){
//   return (
//     <Card className="relative rounded-sm p-0 m-0 shadow-none dark:bg-transparent">
//       <CardHeader className="p-2 px-4 flex flex-row items-center justify-between">
//         {label}
//         <Icon size={16}/>
//       </CardHeader>
//       {progress ? (
//         <CardContent className="p-2 px-4 font-semibold text-xl flex gap-2 items-center">
//           <p>{data}%</p>
//           <Progress value={data} />
//         </CardContent>
//       ) : (
//         <CardContent className="p-2 px-4 font-semibold text-xl">
//           {data}
//         </CardContent>
//       )}
//     </Card>
//   )
// }

// export function AdvancedStatsCard({
//   label,
//   sublabel,
//   title,
//   icon: Icon
// }: AdvanceStats) {
//   return (
//     <Card className="relative rounded-sm shadow-none dark:bg-transparent">
//       {/* <div className="absolute inset-0 bg-dot-pattern opacity-20"></div> */}
//       <CardHeader className="py-3 flex flex-row items-center justify-between">
//         {title}
//         <Icon size={16} />
//       </CardHeader>
//       <CardContent className="pb-3 flex flex-col">
//         <p className=" font-semibold">{label}</p>
//         <p className="text-slate-800 dark:text-slate-400 text-sm">
//           { sublabel && sublabel.split(", ").length > 2
//             ? sublabel.split(", ").slice(0, 2).join(", ") + " and more..."
//             : sublabel}
//         </p>
//       </CardContent>
//     </Card>
//   )
// }
