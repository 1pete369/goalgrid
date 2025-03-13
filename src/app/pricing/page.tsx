
import PricingFooter from "@/features/pricing/PricingFooter"
import PricingHeader from "@/features/pricing/PricingHeader"
import PricingPlanList from "@/features/pricing/PricingPlanList"

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-75px)]">
      <PricingHeader />
      <PricingPlanList />
      <PricingFooter />
    </div>
  )
}

export default Pricing
