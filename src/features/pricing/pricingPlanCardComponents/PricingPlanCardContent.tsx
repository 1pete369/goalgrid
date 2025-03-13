"use client"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { PricingPlan } from "@/types/subscriptionTypes"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { handleCreateSubscription } from "../PricingPlanAction"
import { Loader2 } from "lucide-react"
import Link from "next/link"

type PricingPlanCardContent = {
  pricingPlan: PricingPlan
}

export default function PricingPlanCardContent({
  pricingPlan
}: PricingPlanCardContent) {
  const { user } = useUserContext()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { data: session, update } = useSession()

  useEffect(() => {
    if (session?.user) {
      console.log("User is authenticated:", session.user)
      setSelectedPlan(session.user.subscriptionPlan)
    }
  }, [session]) // Only re-run when session changes

  const handlePricingPlanPurchasing = async () => {
    setIsPurchasing(true)
    if (user !== null) await handleCreateSubscription(pricingPlan, user)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await update()
    setIsPurchasing(false)
  }
  const isPlanPurchased = selectedPlan === pricingPlan.plan
  const isFreePlan = pricingPlan.plan === "free"

  return (
    <CardContent className="flex flex-col gap-2 pb-2 px-4">
      {session?.user.id === undefined ? (
        <Link href={"/auth/login"}>
          <Button className="w-full text-base dark:text-white tracking-wide">
            {isFreePlan ? "Get started for Free!" : "Get started"}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={handlePricingPlanPurchasing}
          className={`w-full text-base  dark:text-black dark:bg-white bg-black tracking-wide ${
            isPlanPurchased
              ? "bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500"
              : pricingPlan.isPopular &&
                "bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500"
          }`}
          disabled={isPurchasing || isPlanPurchased} // Prevent further clicks while purchasing
        >
          {isPurchasing ? (
            <p className="flex gap-2 items-center">
              Purchasing <Loader2 className="animate-spin" />
            </p>
          ) : isPlanPurchased ? (
            "Purchased"
          ) : isFreePlan ? (
            "Get started for Free!"
          ) : (
            "Get started"
          )}
        </Button>
      )}
      <p>{pricingPlan.description}</p>
    </CardContent>
  )
}
