import React from "react"
import PricingPlanCard from "./pricingPlanCardComponents/PricingPlanCard"
import { pricingPlanList } from "./PricingConstants"

export default function PricingPlanList() {
  return (
    <div className="container mx-auto py-10 px-4 lg:p-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pricingPlanList.map((pricingPlan, i) => {
          return <PricingPlanCard key={i} pricingPlan={pricingPlan} />
        })}
      </div>
    </div>
  )
}
