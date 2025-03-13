import { CardFooter } from "@/components/ui/card"
import { Check } from "lucide-react"
import React from "react"

export default function PricingPlanCardFooter({
  features
}: {
  features: string[]
}) {
  return (
    <CardFooter className="flex flex-col mx-3 items-start border-t border-dashed px-2">
      <p className="font-semibold mt-2">what's included</p>
      <div className="flex flex-col gap-2 mt-2">
        {features.map((feature, i) => {
          return (
            <div className="flex gap-2 items-center" key={i}>
              <Check size={20} />
              <p>{feature}</p>
            </div>
          )
        })}
      </div>
    </CardFooter>
  )
}
