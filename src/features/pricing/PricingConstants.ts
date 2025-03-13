import { PricingPlan } from "@/types/subscriptionTypes"

export const pricingPlanList: PricingPlan[] = [
  {
    title: "Free",
    plan: "free",
    price: 0,
    billingCycle: null,
    description: "Kickstart your productivity journey—no cost",
    features: [
      "Task & habit tracking",
      "10 journal entries per month",
      "Weekly progress insights",
      "Simple, distraction-free dashboard"
    ],
    durationInMonths: 1,
    isPopular: false
  },
  {
    title: "Personal",
    plan: "personal",
    price: 9,
    billingCycle: "monthly",
    description: "Master your time, set goals, and stay on track effortlessly.",
    features: [
      "Advanced goal setting",
      "Customizable dashboard",
      "Smart reminders & notifications",
      "Unlimited journal entries",
      "Data export (CSV/PDF)"
    ],
    durationInMonths: 1,
    isPopular : false
  },
  {
    title: "Community",
    plan: "community",
    price: 29,
    billingCycle: "monthly",
    description: "Stay accountable with a supportive community of winners.",
    features: [
      "Community challenges",
      "Accountability partners",
      "Group habit tracking",
      "Public progress sharing",
      "Exclusive webinars & events"
    ],
    durationInMonths: 1,
    isPopular : true,
    badge : "Most popular"
  },
  {
    title: "Premium",
    plan: "premium",
    price: 49,
    billingCycle: "monthly",
    description: "Unlock premium tools for productivity, health & expert coaching.",
    features: [
      "Workout & health tracking",
      "Personalized diet & meal plans",
      "Private coaching & expert insights",
      "Advanced performance analytics",
      "Priority support & premium-only resources"
    ],
    durationInMonths: 1,
    isPopular : false,
    badge : "Best plan"
  },
  {
    title: "Diamond (Yearly)",
    plan: "diamond",
    price: 99,
    billingCycle: "yearly",
    description: "Go all-in on your growth & save 20% with an annual plan.",
    features: [
      "Everything in Personal Plan",
      "12 months of full access",
      "Early access to new features",
      "Priority customer support"
    ],
    durationInMonths: 12,
    isPopular : false,
    badge: "Best value"
  }
]
