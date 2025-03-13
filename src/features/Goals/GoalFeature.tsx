"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useEffect, useState, useRef } from "react"

import Greetings from "@/AppComponents/Greetings"
import { Goal } from "@/types/goalFeatureTypes"
import { getGoals } from "@/utils/goals"
import GoalCard from "./GoalFeatureComponents/GoalCard/GoalCard"
import GoalFeatureForm from "./GoalFeatureComponents/GoalFeatureForm"
import { delay } from "@/utils/delay"
import GoalsSkeleton from "@/skeletons/GoalSkeleton"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { useCustomToast } from "@/hooks/useCustomToast"

export default function GoalFeature() {
  const { user } = useUserContext()
  const [goals, setGoals] = useState<Goal[] | []>([])
  const [loading, setLoading] = useState(false)
  const { showToast } = useCustomToast();


  // Ref to check if goals have been fetched for this session/user
  const [hasFetchedGoals, setHasFetchedGoals] = useState(false);


  useEffect(() => {
    if (user!==null && !hasFetchedGoals) {
      async function fetchGoals() {
        setLoading(true);
        console.log("Fetching goals");
        const result = await getGoals(user?.uid as string);
        console.log("Fetching goals", result);
        if (result.success) {
          setGoals(result.data);
          setHasFetchedGoals(true); // Prevent re-fetch
        } else {
          showToast(result.message, result.status);
        }
        setLoading(false);
      }
      fetchGoals();
    }
  }, [user, hasFetchedGoals]); // Depend on state instead of ref
   // Only re-run the effect when the user changes

  if(user===null) return <FullPageLoading />

  return (
<div className="container min-h-[calc(100vh-64px)] md:px-16 p-4 pt-20">
  <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
    <Greetings feature="goals" />
    <GoalFeatureForm setGoals={setGoals} />
  </header>
  <section className="flex flex-col md:flex-row gap-4 mt-4">
    {loading ? (
      <GoalsSkeleton />
    ) : Array.isArray(goals) && goals.length > 0 ? (
      <div className="flex flex-wrap gap-4 w-full">
        {goals.map((goal, i) => {
          return (
            <div key={i} className="flex-shrink-0">
              <GoalCard goal={goal} setGoals={setGoals} />
            </div>
          )
        })}
      </div>
    ) : (
      <p className="mt-4">No goals yet!</p>
    )}
  </section>
</div>  
  )
}
