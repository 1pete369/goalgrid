import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function TodayTodoCardSkeleton() {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-20 w-[280px]" />
          <Skeleton className="h-20 w-[280px]" />
        </div>
      </div>
    </div>
  )
}
