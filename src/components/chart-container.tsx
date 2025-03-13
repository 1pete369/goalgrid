"use client"

import type React from "react"
import { createContext, useContext } from "react"

interface ChartConfigContextProps {
  config: any
}

const ChartConfigContext = createContext<ChartConfigContextProps | undefined>(undefined)

interface ChartContainerProps {
  config: any
  children: React.ReactNode
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  return <ChartConfigContext.Provider value={{ config }}>{children}</ChartConfigContext.Provider>
}

interface ChartTooltipContentProps {
  indicator?: "circle" | "dashed"
}

export function ChartTooltipContent({ indicator }: ChartTooltipContentProps) {
  const { config } = useContext(ChartConfigContext) || { config: {} }

  return (
    <div className="p-2 bg-white border rounded shadow-md">
      {Object.entries(config).map(([key, value]: [string, any]) => (
        <div key={key} className="flex items-center space-x-2">
          {indicator === "circle" && (
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: value.color }}></span>
          )}
          {indicator === "dashed" && (
            <span className="w-4 border-b border-dashed" style={{ borderColor: value.color }}></span>
          )}
          <span>{value.label}:</span>
          <span>{new Intl.NumberFormat().format(0)}</span>
        </div>
      ))}
    </div>
  )
}

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

