"use client"

import { BasicStats, BasicStatsCard } from "@/AppComponents/analytics/cards"
import { getOverAllStatsForGoals } from "@/AppComponents/analytics/helperFunctions"
import {
  GoalAnalyticsData,
  GoalOverallStats
} from "@/AppComponents/analytics/insightsDataTypes"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
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
import GoalInsightsSkeleton from "@/skeletons/GoalInsightsSkeleton"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

const AnalyticsCharts: React.FC = () => {
  const [analytics, setAnalytics] = useState<GoalAnalyticsData | null>(null)
  const [overAllStats, setOverAllStats] = useState<BasicStats[] | null>(null)

  const [isLoading,setIsLoading]= useState(false)

  const [categoryProgress, setCategoryProgress] = useState<
    { name: string; averageProgress: number; fill: string }[]
  >([])

  const [pieData, setPieData] = useState<
    { name: string; value: number; fill: string }[]
  >([])

  const [totalCompletedPieData, setTotalCompletedPieData] = useState<
    { name: string; value: number; fill: string }[]
  >([])
  const { user } = useUserContext()

  const TotalGoalsCountPieChartConfig: Record<
    string,
    { label: string; color: string }
  > = {
    Productivity: {
      label: "Productivity",
      color: "#FF9999" // Soft Red with more contrast
    },
    Fitness: {
      label: "Fitness",
      color: "#6EE7B7" // Light Green-400 (Higher contrast than 300)
    },
    Health: {
      label: "Health",
      color: "#FDE047" // Light Yellow-400 (Brighter but soft)
    },
    Learning: {
      label: "Learning",
      color: "#60A5FA" // Light Blue-400 (More contrast)
    },
    "Self-Improvement": {
      label: "Self-Improvement",
      color: "#F472B6" // Light Pink-400 (More vivid)
    },
    Hobbies: {
      label: "Hobbies",
      color: "#FB923C" // Light Orange-400 (More saturation)
    },
    "Mental Health": {
      label: "Mental Health",
      color: "#C084FC" // Light Purple-400 (Higher contrast)
    },
    Creativity: {
      label: "Creativity",
      color: "#4ADE80" // Light Green-400 (Balanced contrast)
    },
    Work: {
      label: "Work",
      color: "#CBD5E1" // Light Slate-400 (Softer but visible)
    }
  }

  const pieChartConfig = {
    completed: {
      label: "Completed",
      color: "#22C55E" // Tailwind Green-500
    },
    active: {
      label: "Active",
      color: "#3B82F6" // Tailwind Blue-500
    }
  }
  // Define an array of distinct colors
  const colors = [
    "#3B82F6", // Blue
    "#FACC15", // Yellow
    "#FF6B6B", // Red
    "#16A34A", // Green
    "#EC4899", // Pink
    "#9333EA", // Purple
    "#F97316", // Orange
    "#22C55E", // Light Green
    "#64748B", // Slate Gray
    "#0EA5E9" // Light Blue
  ]

  const barChartConfig = {
    name: {
      label: "name",
      color: "#22C55E",
      title: "title",
      averageProgress: "50"
    }
  }

  useEffect(() => {
    if (categoryProgress.length > 0) {
      console.log("categoryProgress", categoryProgress)
    }
  }, [categoryProgress])

  useEffect(() => {
    if (!analytics) return; // Ensure analytics is not null or undefined

    // Ensure overallStats is valid before calling the function
    if (analytics.overallStats) {
      setOverAllStats(
        getOverAllStatsForGoals(analytics.overallStats as GoalOverallStats)
      )
    }
  
    // Ensure categoryPieChart exists and is an array before mapping
    if (Array.isArray(analytics.categoryPieChart)) {
      const categoryChartData = analytics.categoryPieChart.map((item) => ({
        name: item.category,
        value: item.count ?? 0, // Fallback to 0 if count is undefined
        fill: TotalGoalsCountPieChartConfig[item.category]?.color || "#CCCCCC"
      }))
      setPieData(categoryChartData)
  
      // IMPORTANT: Use the correct mapping for category progress
      const categoryProgressData = analytics.categoryPieChart.map((item) => ({
        name: item.category,
        averageProgress: parseInt(item.averageProgress) || 0, // Ensure valid number
        fill: TotalGoalsCountPieChartConfig[item.category]?.color || "#CCCCCC"
      }))
      setCategoryProgress(categoryProgressData)
    }
  
    // Ensure overallStats exists before accessing properties
    if (analytics.overallStats) {
      setTotalCompletedPieData([
        {
          name: "Completed",
          value: analytics.overallStats.completedGoals ?? 0, // Fallback to 0
          fill: "#22C55E"
        },
        {
          name: "Active",
          value:
            (analytics.overallStats.totalGoals ?? 0) -
            (analytics.overallStats.completedGoals ?? 0),
          fill: "#3B82F6"
        }
      ])
    }
  }, [analytics])
  

  useEffect(() => {
    if (user !== null) {
      const getAnalytics = async () => {
        try {
          setIsLoading(true)
          const res = await axios.get(`/api/analytics/goals/`)
          // Introduce a slight delay before setting the data
          const data = res.data
          setAnalytics(data)
        } catch (error) {
          console.error("Error fetching analytics:", error)
        }finally {
          setIsLoading(false) // Stop loading after success or error
        }
      }
      getAnalytics()
    }
    
  }, [user])

  // if (!analytics) return <p>Loading...</p>
    if (user === null) return <FullPageLoading />
  
    if (isLoading) return <GoalInsightsSkeleton />

  return (
    <div className="container min-h-screen p-4 md:px-16 pt-20 space-y-2 mx-auto bg-squares">
      <h2 className="text-xl font-bold mb-4">📊 Goals Analytics</h2>
      <h2 className="font-semibold">Overall Stats</h2>
      {Array.isArray(overAllStats) && overAllStats.length > 0 ? (
        <section className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[50px] ">
          {overAllStats.map((basicStat: BasicStats) => {
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent">
          <CardHeader>
            <CardTitle className="mt-4">
              Total goals count based on categories
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {Array.isArray(pieData) && pieData.length > 0 ? (
              <ChartContainer
                config={TotalGoalsCountPieChartConfig}
                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    // innerRadius={60} // Donut hole
                    // outerRadius={100} // Thickness of the donut
                    strokeWidth={2}
                    isAnimationActive={true}
                    label={(entry) => `${entry.value}`}
                  >
                    {pieData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
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

                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
          {Array.isArray(pieData) && pieData.length > 0 && (
            <CardFooter className="flex flex-col gap-2">
              <div className="flex flex-wrap justify-center gap-4 mt-4">
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
            </CardFooter>
          )}
        </Card>

        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent">
          <CardHeader>
            <CardTitle className="mt-4">Total vs. Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {Array.isArray(totalCompletedPieData) &&
            totalCompletedPieData.length > 0 ? (
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={totalCompletedPieData}
                    dataKey="value"
                    nameKey="name"
                    // innerRadius={60} // Donut hole
                    // outerRadius={100} // Thickness of the donut
                    strokeWidth={2}
                    isAnimationActive={true}
                    label={(entry) => `${entry.value}`}
                  >
                    {totalCompletedPieData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
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

                <p className="absolute  text-lg font-medium  px-4 py-2 ">
                  No enough data to show!
                </p>
              </div>
            )}
          </CardContent>
          {Array.isArray(totalCompletedPieData) &&
            totalCompletedPieData.length > 0 && (
              <CardFooter className="flex flex-col gap-2">
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {totalCompletedPieData?.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: entry.fill }}
                      ></div>
                      {entry.name}
                    </div>
                  ))}
                </div>
              </CardFooter>
            )}
        </Card>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative shadow-none rounded-sm w-full dark:bg-transparent">
          <CardHeader>
            <CardTitle className="mt-4">Goal Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-60 w-full">
            {Array.isArray(categoryProgress) && categoryProgress.length > 0 ? (
              <ChartContainer config={barChartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={categoryProgress}
                    layout="horizontal"
                    margin={{ bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12 }}
                      interval={0} // Show all labels
                      angle={-40} // Rotate labels to prevent overlap
                      textAnchor="end" // Align rotated text properly
                    />
                    <YAxis type="number" domain={[0, 100]} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="averageProgress" fill="#60A5FA">
                      {categoryProgress.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="relative h-full w-full flex flex-col justify-center items-center">
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

export default AnalyticsCharts
