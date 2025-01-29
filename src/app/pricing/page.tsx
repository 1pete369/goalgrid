"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import axios from "axios"
import { addMonths, format } from "date-fns"
import React from "react"

type PricingPlan = {
  id: number
  title: string
  plan: "free" | "personal" | "community" | "premium" | "diamond"
  price: number
  description: string
  features: string[]
  durationInMonths: number
}

export type Subscription = {
  id: string
  uid: string
  plan: "free" | "personal" | "community" | "premium" | "diamond"
  startDate: string
  expiryDate: string
  isActive: boolean
  durationInMonths: number
}

const Pricing = () => {
  const { user } = useUserContext()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (user !== null) setSelectedPlan(user?.customData.subscription)
  }, [user])

  if (user === null) {
    return <p>Loading...</p>
  }

  const freePricingPlan: PricingPlan = {
    id: 1,
    title: "Personal Accountability",
    plan: "free",
    price: 0,
    durationInMonths: 0,
    description: "The ideal plan for Beginners",
    features: [
      "Personal Task Management and To-Do Lists",
      "Habit Tracking with Streak Maintenance",
      "Progress Insights and Weekly Reviews"
    ]
  }

  const pricingPlans: PricingPlan[] = [
    {
      id: 1,
      title: "Personal Accountability",
      plan: "personal",
      price: 9,
      durationInMonths: 1,
      description:
        "The ideal plan for individuals focused on building personal habits and tracking progress.",
      features: [
        "Personal Task Management and To-Do Lists",
        "Habit Tracking with Streak Maintenance",
        "Progress Insights and Weekly Reviews"
      ]
    },
    {
      id: 2,
      title: "Personal & Community Features",
      plan: "community",
      price: 29,
      durationInMonths: 1,
      description:
        "Ideal for those who want to combine personal accountability with a supportive community for additional motivation.",
      features: [
        "All Personal Accountability Features",
        "Community Challenges and Group Collaboration",
        "Task Sharing and Feedback from Peers"
      ]
    },
    {
      id: 3,
      title: "Premium Features",
      plan: "premium",
      price: 49,
      durationInMonths: 1,
      description:
        "The ultimate plan for users who want comprehensive support, including health tracking and workout suggestions.",
      features: [
        "All Personal & Community Features",
        "Health Tracking with Personalized Diet Plans",
        "Customized Gym/Home Workouts for Specific Goals",
        "Exclusive Chats and One-on-One Support"
      ]
    },
    {
      id: 4,
      title: "Yearly Premium Plan",
      plan: "diamond",
      price: 499,
      durationInMonths: 12,
      description:
        "A discounted yearly plan for users who want comprehensive support with long-term benefits.",
      features: [
        "All Premium Features",
        "Save up to 15% with this yearly subscription",
        "Long-term access to Personalized Diet Plans and Workouts",
        "Continuous updates and exclusive benefits for subscribers"
      ]
    }
  ]

  const calculateSubscriptionDates = (pricingPlan: PricingPlan) => {
    const now = new Date()
    const startDate = format(now, "yyyy-MM-dd HH:mm:ss")
    const expiryDate = format(
      addMonths(now, pricingPlan.durationInMonths),
      "yyyy-MM-dd HH:mm:ss"
    )

    return { startDate, expiryDate }
  }

  const handleCreateSubscription = async (pricingPlan: PricingPlan) => {
    if (pricingPlan.plan === "free") {
      setIsCancelling(true)
    } else {
      setIsPurchasing(true)
    }
    if (user !== null) {
      const { startDate, expiryDate } = calculateSubscriptionDates(pricingPlan)

      const subscription_response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/check-subscription-status/${user.uid}`
      )

      const isSubscriptionCreated =
        subscription_response.data.isSubscriptionCreated

      if (isSubscriptionCreated) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/update-subscription-status/${user.uid}`,
          { plan: pricingPlan.plan, startDate, expiryDate, isActive: true }
        )

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/update-subscription-status/${user.uid}`,
          { plan: pricingPlan.plan }
        )
        setIsCancelling(false)
        setIsPurchasing(false)
      } else {
        const subscriptionObject: Subscription = {
          id: crypto.randomUUID(),
          uid: user?.uid,
          plan: pricingPlan.plan,
          startDate,
          expiryDate,
          isActive: true,
          durationInMonths: pricingPlan.durationInMonths
        }

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-subscription`,
          { subscriptionObject }
        )

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/update-subscription-status/${user.uid}`,
          { plan: pricingPlan.plan }
        )
        setIsPurchasing(false)
      }
      setSelectedPlan(pricingPlan.plan) // Immediately update selected plan
    }
  }

  return (
    <div className="bg-gray-50">
      <section className="bg-blue-600 text-white py-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">Choose Your Plan</h1>
        <p className="text-xl">
          Take control of your productivity journey with our tailored plans.
          Start achieving your goals today!
        </p>
      </section>
      <div className="flex flex-col gap-2 items-center sm:flex-wrap sm:flex-row sm:items-center sm:justify-center text-center text-lg tracking-wide text-white font-semibold bg-primary-500 py-2">
        <p> Current plan: {selectedPlan || "None"} </p>
        {selectedPlan !== "free" && (
          <Button
            onClick={() => handleCreateSubscription(freePricingPlan)}
            disabled={selectedPlan === "free"}
            className={`px-6 py-3 rounded-lg text-lg ${
              selectedPlan === "free"
                ? " text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Cancel subscription
          </Button>
        )}
      </div>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pricingPlans.map((pricingPlan) => {
            const isCurrentPlan = selectedPlan === pricingPlan.plan
            return (
              <div
                key={pricingPlan.id}
                className={`rounded-lg shadow-lg p-8 text-center transition-transform transform hover:scale-105 duration-300 max-w-sm ${
                  isCurrentPlan
                    ? "bg-green-100 border-green-600 border-2"
                    : "bg-white"
                }`}
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {pricingPlan.title}
                </h2>
                <p className="text-4xl font-bold mb-4 text-blue-600">
                  ${pricingPlan.price}/month
                </p>
                <p className="text-lg mb-6">{pricingPlan.description}</p>
                <ul className="text-left space-y-3 mb-6 text-gray-800">
                  {pricingPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-600 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 9l3 3L15 5"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleCreateSubscription(pricingPlan)}
                  disabled={isCurrentPlan}
                  className={`px-6 py-3 rounded-lg text-lg ${
                    isCurrentPlan
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isCurrentPlan
                    ? isPurchasing
                      ? "Purchasing..."
                      : "Current Plan"
                    : "Get Started"}
                </Button>
              </div>
            )
          })}
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-10 text-center">
        <p>&copy; 2025 My Web App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Pricing
