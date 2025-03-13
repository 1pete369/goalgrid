import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Habit } from '@/types/habitFeatureTypes'
import { getTodayDate } from '@/utils/basics'

type HabitCardContentPropsType={
    habit : Habit
    handleCheckboxClick:(habit: Habit) => void
}

export default function HabitCardContent({habit , handleCheckboxClick}: HabitCardContentPropsType) {

  const today=getTodayDate()

  const checkboxValue = habit.dailyTracking[today]
  const isHabitExpired = (habit.endDate && today >= habit.endDate) || habit.status==="completed";

  return (
    <CardContent className="p-0 py-2 m-0 px-4 ">
        <div className="flex flex-row gap-3 items-center">
          <Checkbox
            id={habit.id}
            onCheckedChange={() => handleCheckboxClick(habit)}
            checked={(checkboxValue===true ? true : false) || isHabitExpired}
            disabled={isHabitExpired}
            className={`h-5 w-5 mt-0.5 rounded-sm border-green-500 data-[state=checked]:bg-green-500 /data-[state=checked]:text-black shadow-none`}
          />
          <Label
            htmlFor={habit.id}
            className={`text-sm tracking-wide w-full cursor-pointer  ${ isHabitExpired &&"line-through"}`}
          >
            {habit.name.toWellFormed()}
          </Label>
        </div>
      </CardContent>
  )
}
