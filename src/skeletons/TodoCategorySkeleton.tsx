import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function TodoCategoryCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-wrap gap-4 md:flex-row">
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
        <Skeleton className='h-[350px] w-[246px]'/>
    </div>
  )
}
