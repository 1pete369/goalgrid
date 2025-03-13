import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts"
import { barChartConfig } from "./taskInsightsConstants"

export default function TotalCompletionDataChart({
  getCurrentWeek
}: {
  getCurrentWeek: () => {
    date: string
    completed: number
    total: number
  }[]
}) {
  return (
      <ChartContainer config={barChartConfig}>
        <BarChart
          accessibilityLayer
          data={getCurrentWeek()}
          margin={{ left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" padding={{ left: 0, right: 0 }} />
          <YAxis width={30} dataKey="total" />
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
  )
}
