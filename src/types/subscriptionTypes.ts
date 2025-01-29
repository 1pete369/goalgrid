export type PricingPlan = {
  id: number
  title: string
  plan: "personal" | "community" | "premium"
  price: number
  description: string
  features: string[]
  durationInMonths: number
}

export type Subscription = {
  id: string
  uid: string
  plan: "personal" | "community" | "premium"
  startDate: string
  expiryDate: string
  isActive: boolean
  durationInMonths: number
}
