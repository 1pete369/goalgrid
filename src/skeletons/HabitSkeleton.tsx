import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function HabitsSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56 " />
        <div className="flex flex-col md:flex-row gap-4 ">
          <Skeleton className="h-24 w-[250px]" />
          <Skeleton className="h-24 w-[250px]" />
        </div>
      </div>
    </div>
  )
}
