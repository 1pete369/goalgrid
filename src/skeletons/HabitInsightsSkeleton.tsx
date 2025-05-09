import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function HabitInsightsSkeleton() {
  return (
    <div className="container min-h-screen flex flex-col gap-5 p-4 md:px-16 pt-20 space-y-2 mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <Skeleton className="h-[76px] md:w-[290px] w-full" />
        <Skeleton className="h-[76px] md:w-[290px] w-full" />
        <Skeleton className="h-[76px] md:w-[290px] w-full" />
        <Skeleton className="h-[76px] md:w-[290px] w-full" />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-[90px] md:w-[290px] w-full" />
        <Skeleton className="h-[90px] md:w-[290px] w-full" />
        <Skeleton className="h-[90px] md:w-[290px] w-full" />
        <Skeleton className="h-[90px] md:w-[290px] w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}
