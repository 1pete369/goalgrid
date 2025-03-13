"use client"

import Greetings from "@/AppComponents/Greetings"
import React from "react"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import RewardsTabs from "./rewardFeatureComponents/RewardsTabs"

export default function RewardsFeature() {
  const { user } = useUserContext()

  if (user === null) return <FullPageLoading />

  return (
    <div className="container min-h-[calc(100vh-64px)] md:px-16 pt-20 p-4">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Greetings type="rewards" />
        </div>
      </header>
      <RewardsTabs />
    </div>
  )
}
