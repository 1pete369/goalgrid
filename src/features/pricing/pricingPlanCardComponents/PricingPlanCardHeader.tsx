import { CardDescription, CardHeader } from '@/components/ui/card'
import React from 'react'

type PricingPlanCardHeaderPropsType = {
    title : string
    price : number
    isPopular : boolean
    billingCycle : string
}

export default function PricingPlanCardHeader({title,price,billingCycle,isPopular}:PricingPlanCardHeaderPropsType) {
  return (
    <CardHeader className="relative">
    <CardDescription className={`font-bold text-lg w-max rounded-lg ${isPopular &&"text-blue-500"}`}>
      {title.toWellFormed()}
    </CardDescription>
    <CardDescription className="font-semibold text-black dark:text-white pt-2">
      <span className="text-3xl">${price}</span>
      <span className="text-lg">
        /per {billingCycle === "monthly" ? "month" : "year"}
      </span>
    </CardDescription>
  </CardHeader>
  )
}
