"use client"

import React, { JSX } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gift,
  Medal,
  LogIn,
  CheckCircle,
  NotebookPen,
  BookText,
  Repeat,
  CalendarCheck2,
  MessageCircle,
  Heart,
  Trophy,
  Target,
  Award
} from "lucide-react"
import { dailyRewards } from "./RewardsConstants"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Define icons for Daily Rewards
const dailyRewardIcons: Record<string, JSX.Element> = {
  "Login to the app": <LogIn size={18} className="text-blue-500" />,
  "Complete 1 task": <CheckCircle size={18} className="text-green-500" />,
  "Complete 3 tasks": <CheckCircle size={18} className="text-green-500" />,
  "Write 1 note": <NotebookPen size={18} className="text-yellow-500" />,
  "Write 1 journal entry": <BookText size={18} className="text-orange-500" />,
  "Complete 1 habit": <Repeat size={18} className="text-purple-500" />,
  "Complete 3 habits": <Repeat size={18} className="text-purple-500" />,
  "Check streaks": <CalendarCheck2 size={18} className="text-red-500" />,
  "Comment on a post": <MessageCircle size={18} className="text-pink-500" />,
  "React to 5 community posts": <Heart size={18} className="text-rose-500" />
}

// Define icons for Extra Rewards
const extraRewardIcons: Record<string, JSX.Element> = {
  "Reach a 7-day streak": <Trophy size={18} className="text-orange-500" />,
  "Reach a 30-day streak": <Award size={18} className="text-gold-500" />,
  "Complete 50 tasks": <Target size={18} className="text-teal-500" />,
  "Complete 100 tasks": <Target size={18} className="text-blue-500" />,
  "Win a community challenge": <Medal size={18} className="text-purple-500" />
}

export default function RewardsTabs() {
  const { user } = useUserContext()

  if (user === null) return <FullPageLoading />

  // Ensure valid plan exists; fallback to "free"
  const plan =
    (user?.customData.subscription as keyof typeof dailyRewards) || "free"

  const dailyPlanRewards = dailyRewards[plan] || []
  //   const extraPlanRewards = extraRewards[plan] || []

  return (
    <section className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full flex rounded-sm">
          <TabsTrigger
            value="daily"
            className="w-full flex items-center justify-center gap-2 text-base rounded-sm"
          >
            <Gift size={18} /> Daily Rewards
          </TabsTrigger>
          <TabsTrigger
            value="extra"
            className="w-full flex items-center justify-center gap-2 text-base rounded-sm"
          >
            <Medal size={18} /> Extra Rewards
          </TabsTrigger>
        </TabsList>

        {/* Daily Rewards Tab */}
        <TabsContent
          value="daily"
          className="mt-4 p-4 border rounded-sm shadow"
        >
          <p className="mb-2 text-lg font-semibold">
            🎁 Claim your <strong>Daily Rewards</strong> by completing tasks!
          </p>
          {dailyPlanRewards.length > 0 ? (
            <ul className="list-none pl-0 space-y-2 mt-4">
              {dailyPlanRewards.map((reward, index) => (
                <Card
                  key={index}
                  className="text-sm flex flex-col items-center gap-2 bg-transparent dark:bg-transparent rounded-none"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-4 w-full  p-3">
                    {/* Centering the icon */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full">
                        {dailyRewardIcons[reward.task] || (
                          <CheckCircle size={20} className="text-gray-500" />
                        )}
                      </div>
                      <p className="text-lg font-medium">{reward.task}</p>
                    </div>
                    <Button className="bg-gradient-to-tr from-indigo-400 to-cyan-400 text-lg text-black/90 font-semibold select-none">
                      Claim{" "}
                      <p className="text-whmite">
                        {reward.reward}
                      </p>
                      <Image
                        src={"/coin1.png"}
                        height={20}
                        width={20}
                        alt="reward"
                      />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </ul>
          ) : (
            <p>No daily rewards available.</p>
          )}
        </TabsContent>

        {/* Extra Rewards Tab
        <TabsContent value="extra" className="mt-4 p-4 border rounded-lg shadow">
          <p className="mb-2 text-lg font-semibold">🚀 Earn <strong>Extra Rewards</strong> through special achievements!</p>
          {extraPlanRewards.length > 0 ? (
            <ul className="list-none pl-0 space-y-2">
              {extraPlanRewards.map((reward, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  {extraRewardIcons[reward.task] || <Medal size={18} className="text-gray-500" />} 
                  {reward.task} — <span className="font-bold">{reward.reward} tokens</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No extra rewards available.</p>
          )}
        </TabsContent> */}
      </Tabs>
    </section>
  )
}
