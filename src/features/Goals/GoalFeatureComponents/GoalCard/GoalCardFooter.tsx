import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { CardFooter } from "@/components/ui/card"
import { Goal } from "@/types/goalFeatureTypes"
import { Habit } from "@/types/habitFeatureTypes"
import Link from "next/link"

type GoalCardFooterPropsType = {
  goal: Goal
}

export default function GoalCardFooter({ goal }: GoalCardFooterPropsType) {
  return (
    <CardFooter className="px-4">
      {goal.habits.length > 0 ? (
        <Accordion type="single" collapsible className="">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-sm text-black dark:text-slate-400 p-0">
              Habits in progress
            </AccordionTrigger>
            <AccordionContent className="flex flex-col mt-2 gap-1 p-0 text-sm">
              {goal.habits.map((habit: Habit) => {
                return (
                  <p key={habit.id} className="text-neutral-500">
                    {habit.name}
                  </p>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ):
      <Link href={"/work/personal/habits"} className="text-sm text-black dark:text-slate-400 underline">Add habits to goal!</Link>}
    </CardFooter>
  )
}
