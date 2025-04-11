"use client"

import React, { JSX, useEffect, useState } from "react"
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
import axios from "axios"
import { getDailyRewardsStatus } from "@/utils/rewards"
import { DailyRewardsResponseType } from "@/types/rewardsTypes"

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
  "Complete 100 tasks": <Target size={18} className="text-blue-500" />
}

export default function RewardsTabs() {
  const { user } = useUserContext()
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set())
  const [completedTasks, setCompletedTasks] = useState(0)
  const [completedHabits, setCompletedHabits] = useState(0)
  const [notesCount, setNotesCount] = useState(0)
  const [journalsCount, setJournalsCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      if (user!==null) {
        const data: DailyRewardsResponseType = await getDailyRewardsStatus()
        console.log("Data at rewards", data)
        if (data.rewardsClaimed.length > 0) {
          setClaimedRewards(new Set(data.rewardsClaimed[0].rewards))
        }
        setCompletedTasks(data.numberOfCompletedTasks)
        setCompletedHabits(data.numberOfCompletedHabits)
        setNotesCount(data.todayNotesCount)
        setJournalsCount(data.todayJournalsCount)
      }
    }
    loadData()
  }, [user])

  useEffect(() => {
    console.log("claimed rewards", claimedRewards)
  }, [claimedRewards])

  const handleClaimReward = async (task: string, tokens: number) => {
    if (claimedRewards.has(task)) return

    const updatedRewards = new Set([...claimedRewards, task])

    await axios.post(`/api/rewards`, { task, tokens })

    setClaimedRewards(updatedRewards)
  }

  if (user === null) return <FullPageLoading />

  const canClaimReward = (task: string): boolean => {
    if (claimedRewards.has(task)) return false // Already claimed
    switch (task) {
      case "Complete 1 task":
        return completedTasks >= 1
      case "Complete 1 habit":
        return completedHabits >= 1
      case "Complete 3 tasks":
        return completedTasks >= 3
      case "Complete 3 habits":
        return completedHabits >= 3
      case "Write 1 note":
        return notesCount >= 1
      case "Write 1 journal entry":
        return journalsCount >= 1
      default:
        return true
    }
  }

  const plan =
    (user?.customData.subscription as keyof typeof dailyRewards) || "free"
  const dailyPlanRewards = dailyRewards[plan] || []

  return (
    <section className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="daily" className="w-full shadow-none bg-none">
        <TabsList className="w-full flex gap-2 rounded-sm bg-transparent shadow-none ">
          <TabsTrigger
            value="daily"
            className="w-full flex items-center justify-center gap-2 text-base rounded-sm data-[state=active]:border-transparent data-[state=active]:border-b-primary-800  data-[state=active]:border-2"
          >
            <Gift size={18} /> Daily Rewards
          </TabsTrigger>
          <TabsTrigger
            value="extra"
            className="w-full flex items-center justify-center gap-2 text-base rounded-sm data-[state=active]:border-transparent data-[state=active]:border-b-primary-800  data-[state=active]:border-2"
          >
            <Medal size={18} /> Extra Rewards
          </TabsTrigger>
        </TabsList>

        {/* Daily Rewards Tab */}
        <TabsContent value="daily" className="mt-4 p-4 shadow-none">
          <p className="mb-2 text-lg font-semibold">
            🎁 Claim your <strong>Daily Rewards</strong> by completing tasks!
          </p>
          {dailyPlanRewards.length > 0 ? (
            <ul className="list-none pl-0 space-y-1 mt-4">
              {dailyPlanRewards.map((reward, index) => (
                <Card
                  key={index}
                  className="text-sm flex flex-col items-center bg-transparent dark:bg-transparent rounded-none shadow-none border-none"
                >
                  <CardHeader className="flex flex-row items-center justify-between w-full p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full">
                        {dailyRewardIcons[reward.task] || (
                          <CheckCircle size={20} className="text-gray-500" />
                        )}
                      </div>
                      <p className="text-lg font-medium">{reward.task}</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleClaimReward(reward.task, reward.reward)
                      }
                      disabled={!canClaimReward(reward.task)}
                      className={`bg-transparent hover:bg-transparent text-lg font-semibold text-black dark:text-white border-2 select-none ${
                        !canClaimReward(reward.task)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {claimedRewards.has(reward.task)
                        ? "Claimed"
                        : `Claim ${reward.reward}`}
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
      </Tabs>
    </section>
  )
}
