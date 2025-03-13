import React from "react"
import { barChartConfig } from "./taskInsightsConstants"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export default function DropOffDataChart({
  dropOffData
}: {
  dropOffData: any[]
}) {
  return (
    <ChartContainer config={barChartConfig}>
      <BarChart accessibilityLayer data={dropOffData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" />
        <YAxis width={30} dataKey="missedTasks" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar
          dataKey="missedTasks"
          fill={barChartConfig.missedTasks.color} // Better red shade
          isAnimationActive={true}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
