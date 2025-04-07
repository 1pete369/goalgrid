import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function MessagesSkeleton() {
  return (
    <div className=" flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className=" h-14 rounded-md w-[280px] md:w-[400px]" />
          <Skeleton className=" h-14 rounded-md w-[240px] md:w-[350px] justify-end" />
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <div className="flex flex-col gap-2 items-end">
          <Skeleton className=" h-14 rounded-md w-[240px] md:w-[350px] justify-end" />
          <Skeleton className=" h-14 rounded-md w-[280px] md:w-[400px]" />
        </div>
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
      </div>{" "}
      <div className="flex flex-row gap-2">
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className=" h-14 rounded-md w-[280px] md:w-[400px]" />
          <Skeleton className=" h-14 rounded-md w-[240px] md:w-[350px] justify-end" />
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <div className="flex flex-col gap-2 items-end">
          <Skeleton className=" h-14 rounded-md w-[280px] md:w-[400px]" />
          <Skeleton className=" h-14 rounded-md w-[240px] md:w-[350px] justify-end" />
        </div>
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
      </div>
      <div className="flex flex-row gap-2">
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className=" h-14 rounded-md w-[230px] md:w-[380px] justify-end" />
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <div className="flex flex-col gap-2">
          <Skeleton className=" h-14 rounded-md w-[240px] md:w-[350px] justify-end" />
        </div>
        <Skeleton className=" h-[22px] w-[22px] mt-2 rounded-full" />
      </div>
    </div>
  )
}
