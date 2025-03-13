import { Card } from "@/components/ui/card"
import { Habit } from "@/types/habitFeatureTypes"
import HabitCardContent from "./HabitCardContent"
import HabitCardFooter from "./HabitCardFooter"
import HabitCardHeader from "./HabitCardHeader"
import React, { SetStateAction } from "react"
import { Goal } from "@/types/goalFeatureTypes"

type HabitCardPropsType = {
  habit: Habit
  setHabits: React.Dispatch<SetStateAction<Habit[]>>
  handleCheckboxClick: (habit: Habit) => void
  updateTheGoalData: (habit: Habit,updatedHabits?:Habit[], isDeleted ?: boolean) => Promise<void>
  goals : Goal[]
}

export default function HabitCard({
  habit,
  setHabits,
  handleCheckboxClick,
  updateTheGoalData,goals
}: HabitCardPropsType) {
  return (
    <Card
      className="w-full md:w-[250px] rounded-t-sm rounded-b-none flex flex-col justify-between overflow-hidden shadow-none"
      key={habit.id}
      // style={{backgroundColor:habit.habitColor}}
    >
      <HabitCardHeader 
        habit={habit}
        setHabits={setHabits}
        updateTheGoalData={updateTheGoalData}
        goals={goals}
      />
      <HabitCardContent
        habit={habit}
        handleCheckboxClick={handleCheckboxClick}
      />
      <HabitCardFooter habit={habit} />
    </Card>
  )
}