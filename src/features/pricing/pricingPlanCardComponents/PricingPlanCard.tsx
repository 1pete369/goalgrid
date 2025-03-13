import {
  Card
} from "@/components/ui/card"
import { PricingPlan } from "@/types/subscriptionTypes"
import PricingPlanCardBadge from "./PricingPlanCardBadge"
import PricingPlanCardContent from "./PricingPlanCardContent"
import PricingPlanCardFooter from "./PricingPlanCardFooter"
import PricingPlanCardHeader from "./PricingPlanCardHeader"

type PricingPlanPropsType = {
  pricingPlan: PricingPlan
}

export default function PricingPlanCard({ pricingPlan }: PricingPlanPropsType) {
  return (
    <Card
      className={`relative ${
        pricingPlan.isPopular
          ? "border-blue-600 bg-gradient-to-b from-blue-200/20 to-cyan-200/20 border-2"
          : "border-black dark:border-white"
      }`}
    >
      {pricingPlan.badge && <PricingPlanCardBadge badge={pricingPlan.badge} isPopular={pricingPlan.isPopular} />}
      <PricingPlanCardHeader
        title={pricingPlan.title}
        price={pricingPlan.price}
        billingCycle={pricingPlan.billingCycle as string}
        isPopular={pricingPlan.isPopular}
      />
      <PricingPlanCardContent pricingPlan={pricingPlan}
      />
      <PricingPlanCardFooter features={pricingPlan.features} />
    </Card>
  )
}
