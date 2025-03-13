import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Goal } from "@/types/goalFeatureTypes"

type GoalCardContentPropsType = {
  goal: Goal
}

export default function GoalCardContent({ goal }: GoalCardContentPropsType) {
  const progressRate = isNaN(goal.progress.completionRate)
    ? 0
    : goal.progress.completionRate.toFixed(0)

  return (
    <CardContent className="flex flex-col gap-3 px-4">
      <div className="">
        <Label htmlFor={goal.id} className="text-lg font-semibold">
          {goal.name.toWellFormed()}
        </Label>
        <p className="text-neutral-500 text-sm break-all">
          {goal.description.toWellFormed()}
        </p>
      </div>
      <div className="relative p-0 m-0">
        <Progress
          value={goal.progress.completionRate}
          className="w-full h-8 rounded-none bg-gray-200" // Light gray background
        />
        <div
          className="absolute inset-0 h-full bg-green-500"
          style={{ width: `${goal.progress.completionRate}%` }}
        ></div>
        <p className="absolute translate-x-28 -translate-y-6 text-sm flex text-gray-800">
          {progressRate}%
        </p>
      </div>
    </CardContent>
  )
}
