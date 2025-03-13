"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import React from "react"

type UsingForCardPropsType = {
  intendedUseCases: string[]
  setIntendedUseCases: React.Dispatch<React.SetStateAction<string[]>>
}

export default function UsingForCard({
  intendedUseCases,
  setIntendedUseCases
}: UsingForCardPropsType) {
  const handleUseCases = (value: string) => {
    setIntendedUseCases(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // Remove if already selected
          : [...prev, value] // Add if not selected
    )
  }

  return (
    <Card className="w-full border-none shadow-none min-h-[600px] dark:bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl">
          What do you want to achieve using this app?
        </CardTitle>
        <CardDescription className="text-lg">
          Choose one or more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-10 max-w-[1200px]">
          {/* Option 1 */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r1"
              className={`${
                intendedUseCases.includes("Boost Productivity") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6 flex gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Boost Productivity"
                id="r1"
                onChange={() => handleUseCases("Boost Productivity")}
              />
              <Image
                src={"/to-do-list.png"}
                height={30}
                width={30}
                className="object-contain"
                alt="to-do-list"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Boost Productivity
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Stay on top of tasks, set daily goals, and track your progress
                  to get more done.
                </p>
              </div>
            </Label>
          </div>

          {/* Option 2 */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r2"
              className={`${
                intendedUseCases.includes("Build Healthy Habits") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Build Healthy Habits"
                id="r2"
                onChange={() => handleUseCases("Build Healthy Habits")}
              />
              <Image
                className="object-contain"
                src={"/daily-tasks.png"}
                height={30}
                width={30}
                alt="daily-tasks"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Build Healthy Habits
                </h1>
                <p className="text-neutral-500">
                  Track habits like exercise, water intake, and sleep to improve
                  your daily routine.
                </p>
              </div>
            </Label>
          </div>

          {/* Option 3 */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r3"
              className={`${
                intendedUseCases.includes("Achieve Personal Goals") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Achieve Personal Goals"
                id="r3"
                onChange={() => handleUseCases("Achieve Personal Goals")}
              />
              <Image
                className="object-contain"
                src={"/target.png"}
                height={30}
                width={30}
                alt="target"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Achieve Personal Goals
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Set personal objectives, break them down into actionable
                  steps, and track your journey.
                </p>
              </div>
            </Label>
          </div>

          {/* Option 4 */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r4"
              className={`${
                intendedUseCases.includes("Track Fitness & Health") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Track Fitness & Health"
                id="r4"
                onChange={() => handleUseCases("Track Fitness & Health")}
              />
              <Image
                className="object-contain"
                src={"/dumbbell.png"}
                height={30}
                width={30}
                alt="dumbbell"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Track Fitness & Health
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Monitor workouts, set fitness targets, and track your health
                  progress for a healthier lifestyle.
                </p>
              </div>
            </Label>
          </div>

          {/* Option 5 */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r5"
              className={`${
                intendedUseCases.includes("Enhance Self-Discipline") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Enhance Self-Discipline"
                id="r5"
                onChange={() => handleUseCases("Enhance Self-Discipline")}
              />
              <Image
                className="object-contain"
                src={"/accountability.png"}
                height={30}
                width={30}
                alt="accountability"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Enhance Self-Discipline
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Build consistency by tracking habits, setting reminders, and
                  maintaining accountability.
                </p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r6"
              className={`${
                intendedUseCases.includes("Grow Social Connections") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Grow Social Connections"
                id="r6"
                onChange={() => handleUseCases("Grow Social Connections")}
              />
              <Image
                className="object-contain"
                src={"/networking.png"}
                height={30}
                width={30}
                alt="networking"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Grow Social Connections
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Join challenges, connect with others, and share your progress
                  with a supportive community.
                </p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r7"
              className={`${
                intendedUseCases.includes("Develop a Balanced Lifestyle") &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  flex  gap-4  border-2 `}
            >
              <Input
                type="checkbox"
                className="hidden"
                value="Develop a Balanced Lifestyle"
                id="r7"
                onChange={() => handleUseCases("Develop a Balanced Lifestyle")}
              />
              <Image
                className="object-contain"
                src={"/yoga.png"}
                height={30}
                width={30}
                alt="yoga"
              />
              <div className="flex flex-col gap-2 justify-center">
                <h1 className="font-bold ">
                  Develop a Balanced Lifestyle
                </h1>
                <p className="text-neutral-500">
                  {" "}
                  Focus on your well-being with tools for mindfulness, stress
                  management, and self-care.
                </p>
              </div>
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {intendedUseCases.includes("other") && (
          <div className="space-y-1">
            <Label htmlFor="other-platform">Other Platform</Label>
            <Input
              id="other-platform"
              className="rounded-sm border-2 border-black/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0"
              placeholder="Ex: Blog post"
            />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
