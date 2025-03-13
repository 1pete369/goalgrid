import { Card } from "@/components/ui/card"

import { Goal } from "@/types/goalFeatureTypes"
import GoalCardContent from "./GoalCardContent"
import GoalCardFooter from "./GoalCardFooter"
import GoalCardHeader from "./GoalCardHeader"
import { Dispatch, SetStateAction } from "react"

type GoalCardPropsType = {
  goal: Goal,
  setGoals : Dispatch<SetStateAction<[] | Goal[]>>
}

export default function GoalCard({ goal, setGoals }: GoalCardPropsType) {
  return (
    <Card className="w-[290px] border rounded-sm" key={goal.id}>
      <GoalCardHeader  goal={goal} setGoals={setGoals}/>
      <GoalCardContent goal={goal} />
      <GoalCardFooter goal={goal} />
    </Card>
  )
}
