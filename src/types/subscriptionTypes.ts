export type PricingPlan = {
  title: string
  plan: "free" | "personal" | "community" | "premium" | "diamond"
  price: number  // Use `null` for free plans
  billingCycle: "monthly" | "yearly" | null
  description: string
  features: string[]
  durationInMonths: number | null
  isPopular: boolean 
  badge ?: string
}

export type Subscription = {
  id: string
  uid: string
  plan: "free" | "personal" | "community" | "premium" | "diamond"
  startDate: string
  expiryDate: string
  isActive: boolean
  durationInMonths: number | null
  billingCycle: "monthly" | "yearly" | null
}

