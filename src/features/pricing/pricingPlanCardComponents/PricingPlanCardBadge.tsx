import React from "react"

export default function PricingPlanCardBadge({
  badge,
  isPopular
}: {
  badge: string
  isPopular: boolean
}) {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 -translate-y-6 font-bold py-2 px-5 w-max rounded-full bg-blue-50 dark:bg-black border-2  ${isPopular ? "border-blue-600" : "border-black dark:border-white "} text-black dark:text-white`}
    >
      {badge}
    </div>
  )
}
