import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function GoalsSkeleton() {
  return (
    <div className="flex flex-col md:flex-wrap gap-4 md:flex-row">
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
        <Skeleton className='h-[220px] w-[290px]'/>
    </div>
  )
}
