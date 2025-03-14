"use client"

import { BasicStats, BasicStatsCard } from "@/AppComponents/analytics/cards"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { formatDateOnDuration } from "@/utils/basics"
import { eachDayOfInterval, format } from "date-fns"
import {
  ArrowLeft,
  ArrowRight,
  ChartColumnIncreasingIcon,
  TargetIcon,
  Trophy,
  Zap
} from "lucide-react"

import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import TaskInsightsSkeleton from "@/skeletons/TaskInsightsSkeleton"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import {
  PriorityAnalyticsData,
  TaskData,
  TaskDurationAnalyticsData,
  TimedAnalyticsData
} from "@/AppComponents/analytics/insightsDataTypes"
import {
  fillMissingDates,
  fillMissingDaysTaskDuration,
  fillMissingDropOffDays,
  getHourData,
  getOverAllStats,
  getPieData,
  getPriorityData,
  getTodayStats
} from "@/AppComponents/analytics/helperFunctions"
import {
  areaChartConfig,
  barChartConfig,
  barChartConfigOfPriorityData,
  dayLabels,
  pieChartConfig
} from "@/AppComponents/analytics/taskInsightsConstants"
import TotalCompletionChart from "@/AppComponents/analytics/DropOffDataChart"
import DropOffDataChart from "@/AppComponents/analytics/DropOffDataChart"
import TotalCompletionDataChart from "@/AppComponents/analytics/TotalCompletionDataChart"

export default function Page() {
  // 1️⃣ State Management
  const [data, setData] = useState<TaskData | null>(null)
  const [overAllStats, setOverAllStats] = useState<BasicStats[] | null>(null)
  const [todayStats, setTodayStats] = useState<BasicStats[] | null>(null)

  const [pieData, setPieData] = useState<any | null>(null)

  const [dropOffData, setDropOffData] = useState<any | null>(null)

  const [hourData, setHourData] = useState<TimedAnalyticsData[] | []>([])

  const [durationData, setDurationData] = useState<
    TaskDurationAnalyticsData[] | []
  >([])

  const [priorityAnalytics, setPriorityAnalytics] = useState<
    PriorityAnalyticsData[] | []
  >([])

  const [completionArray, setCompletionArray] = useState<
    { date: string; completed: number; total: number }[]
  >([])
  const [startIndex, setStartIndex] = useState(0)

  const [durationStartIndex, setDurationStartIndex] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const [isDataFetched, setIsDataFetched] = useState(false)

  // 2️⃣ User Context
  const { user } = useUserContext()

  const moveBackward = () => setStartIndex((prev) => Math.max(0, prev - 7))
  const moveForward = () =>
    setStartIndex((prev) => Math.min(completionArray.length - 7, prev + 7))
  const getCurrentWeek = () => completionArray.slice(startIndex, startIndex + 7)

  const moveDurationBackward = () =>
    setDurationStartIndex((prev) => Math.max(0, prev - 7))

  const moveDurationForward = () =>
    setDurationStartIndex((prev) => Math.min(durationData.length - 7, prev + 7))

  const getCurrentDurationWeek = () =>
    durationData.slice(durationStartIndex, durationStartIndex + 7)

  // 5️⃣ useEffect to Populate `completionArray`
  useEffect(() => {
    if (data !== null) {

      console.log("data",data)

      const dailyCompletionStats = fillMissingDates(data.dailyTaskStats)
      setCompletionArray(
        dailyCompletionStats.map((stat) => ({
          date: formatDateOnDuration(stat.date),
          completed: stat.completedTasks,
          total: stat.totalTasks
        }))
      )

      const dropOffData = fillMissingDropOffDays(data.dropOffData)

      const formattedDropOffData = dropOffData.map((item) => ({
        day: dayLabels.short[item._id - 1], // Short name for X-axis
        fullDay: dayLabels.full[item._id - 1], // Full name for Tooltip
        missedTasks: item.missedTasks
      }))

      setOverAllStats(getOverAllStats(data))
      setTodayStats(getTodayStats(data))
      setPieData(getPieData(data))
      setDropOffData(formattedDropOffData)
      setPriorityAnalytics(getPriorityData(data))
      setDurationData(
        fillMissingDaysTaskDuration(data.overallTaskDurationAnalytics)
      )

      setHourData(getHourData(data.timedData))
      console.log("Printed")
    }
  }, [data])

  useEffect(() => {
    if (user !== null && isDataFetched === false) {
      const getAnalytics = async () => {
        setIsLoading(true) // Show loading state
        try {
          const res = await fetch(
            `http://localhost:3001/today-tasks/analytics/${user.uid}`
          )
          const data = await res.json()
          // Introduce a slight delay before setting the data
          setData(data)
          setIsDataFetched(true)
          setIsLoading(false)
          console.log("got data")
        } catch (error) {
          console.error("Error fetching analytics:", error)
        }
      }
      getAnalytics()
    }
  }, [user, isDataFetched])

  if (user === null) return <FullPageLoading />

  if (isLoading) return <TaskInsightsSkeleton />

  return (
    <div className="container min-h-screen p-4 md:px-16 pt-20 space-y-2 mx-auto">
      <h2 className="text-xl font-bold mb-4">📊 Tasks Analytics</h2>
      <h2 className="font-semibold">Overall Stats</h2>
      {Array.isArray(overAllStats) && overAllStats.length > 0 ? (
        <section className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[50px] ">
          {overAllStats.map((basicStat) => {
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
      ) : (
        <Card className="w-full flex items-center justify-center h-[70px] shadow-none rounded-sm">
          <p className=" text-lg font-medium  px-4 py-2 ">
            No enough data to show!
          </p>
        </Card>
      )}
      <h2 className="font-semibold">Today Stats</h2>
      {Array.isArray(todayStats) && todayStats.length > 0 ? (
        <section className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[50px]">
          {todayStats.map((todayStat) => {
            return (
              <BasicStatsCard
                key={todayStat.label}
                data={todayStat.data}
                label={todayStat.label}
                progress={todayStat.progress}
                icon={todayStat.icon}
              />
            )
          })}
        </section>
      ) : (
        <Card className="w-full flex items-center justify-center h-[70px] shadow-none rounded-sm">
          <p className=" text-lg font-medium  px-4 py-2 ">
            No enough data to show!
          </p>
        </Card>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Total vs. Completed Tasks
            </CardTitle>
            {Array.isArray(completionArray) && completionArray.length > 0 && (
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
            )}
          </CardHeader>
          <CardContent className="relative min-h-60 w-full">
            {Array.isArray(completionArray) && completionArray.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
              <TotalCompletionDataChart getCurrentWeek={getCurrentWeek} />
                </ResponsiveContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent">
          <CardHeader>
            <CardTitle className="mt-4">Total vs. Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {Array.isArray(pieData) && pieData.length > 0 ? (
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60} // Donut hole
                    outerRadius={100} // Thickness of the donut
                    strokeWidth={2}
                    isAnimationActive={true}
                  >
                    {pieData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-xl font-bold"
                              >
                                {data?.totalCompletionRate}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Completed
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
          {Array.isArray(pieData) && pieData.length > 0 && (
            <CardFooter className="flex flex-col gap-2">
              <div className="flex justify-center gap-4 mt-4">
                {pieData?.map((entry: any, index: number) => (
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
          )}
        </Card>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Weekly Breakdown of Missed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-60">
            {Array.isArray(dropOffData) && dropOffData.length > 0 ? (
              <DropOffDataChart dropOffData={dropOffData} />
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Priority-Based Task Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-60">
            {Array.isArray(priorityAnalytics) &&
            priorityAnalytics.length > 0 ? (
              <ChartContainer config={barChartConfigOfPriorityData}>
                <BarChart accessibilityLayer data={priorityAnalytics}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="priority" />
                  <YAxis
                    width={30}
                    dataKey="totalTasks"
                    allowDecimals={false}
                  />{" "}
                  {/* Ensure integer values */}
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="totalTasks"
                    fill={barChartConfigOfPriorityData.totalTasks.color}
                    isAnimationActive={true}
                    radius={4}
                  />
                  <Bar
                    dataKey="completedTasks"
                    fill={barChartConfigOfPriorityData.completedTasks.color}
                    isAnimationActive={true}
                    radius={4}
                  />
                  <Bar
                    dataKey="missedTasks"
                    fill={barChartConfigOfPriorityData.missedTasks.color}
                    isAnimationActive={true}
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Weekly Breakdown of Task Duration spent
            </CardTitle>
            {Array.isArray(durationData) && durationData.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={moveDurationBackward}
                  disabled={durationStartIndex === 0}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="outline"
                  onClick={moveDurationForward}
                  disabled={durationStartIndex + 7 >= durationData.length}
                >
                  <ArrowRight />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="relative min-h-60">
            {Array.isArray(durationData) && durationData.length > 0 ? (
              <ChartContainer config={areaChartConfig}>
                <AreaChart accessibilityLayer data={getCurrentDurationWeek()}>
                  <defs>
                    <linearGradient
                      id="totalGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="10%"
                        stopColor={areaChartConfig.totalDuration.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="90%"
                        stopColor={areaChartConfig.totalDuration.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="completedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="10%"
                        stopColor={areaChartConfig.completedDuration.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="90%"
                        stopColor={areaChartConfig.completedDuration.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="averageGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="10%"
                        stopColor={areaChartConfig.averageDuration.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="90%"
                        stopColor={areaChartConfig.averageDuration.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis width={30} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalDuration"
                    stroke={areaChartConfig.totalDuration.color}
                    fill="url(#totalGradient)"
                    isAnimationActive={true}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completedDuration"
                    stroke={areaChartConfig.completedDuration.color}
                    fill="url(#completedGradient)"
                    isAnimationActive={true}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageDuration"
                    stroke={areaChartConfig.averageDuration.color}
                    fill="url(#averageGradient)"
                    isAnimationActive={true}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold">
              Peak Productivity hours
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-60">
            {Array.isArray(hourData) && hourData.length > 0 ? (
              <ChartContainer config={barChartConfig}>
                {/* <ResponsiveContainer width="100%" height={300}> */}
                <BarChart data={hourData}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip
                    // cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[130px]"
                        indicator="dashed"
                      />
                    }
                  />
                  <Bar dataKey="completedTasks" fill="#22C55E" />
                </BarChart>
                {/* </ResponsiveContainer> */}
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
                {/* Sample Graph with No Data */}
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[]}
                      margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.4)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Centered Message */}
                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
