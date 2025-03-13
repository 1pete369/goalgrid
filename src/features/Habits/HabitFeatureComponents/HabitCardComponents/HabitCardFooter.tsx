import { CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Habit } from "@/types/habitFeatureTypes"

type HabitCardFooterPropsType={
    habit: Habit
}

export default function HabitCardFooter({habit}: HabitCardFooterPropsType) {
  return (
    <CardFooter className="p-0 m-0 relative ">
      <Progress
        value={habit.progress.completionRate}
        className="w-full h-2 rounded-none bg-gray-200"
        color="bg-green-500"
      />
    </CardFooter>
  )
}
