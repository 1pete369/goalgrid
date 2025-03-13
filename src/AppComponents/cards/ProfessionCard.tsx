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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { validateProfession } from "@/utils/validators/onBoardingValidators"
import Image from "next/image"
import React, { ChangeEvent } from "react"

type ProfessionCardPropsType = {
  profession: string
  setProfession: React.Dispatch<React.SetStateAction<string>>
  professionError: string
  setProfessionError: React.Dispatch<React.SetStateAction<string>>
  professionOption: string
  setProfessionOption: React.Dispatch<React.SetStateAction<string>>
}

export default function ProfessionCard({
  profession,
  professionError,
  setProfession,
  setProfessionError,
  professionOption,
  setProfessionOption
}: ProfessionCardPropsType) {
  const handleOtherProfession = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const profession = e.target.value
    console.log("Typed profession:", profession)
    setProfession(profession)
    const error = validateProfession(profession)
    if (error !== "") {
      setProfessionError(error)
    } else {
      setProfessionError(error)
    }
  }

  const handleOption = (value: string) => {
    const option = value
    console.log("OPtion", option)
    setProfessionOption(option)
    if (option !== "other") {
      setProfession(option)
      setProfessionError("")
    } else {
      setProfession("")
    }
  }

  return (
    <Card className="w-full border-none shadow-none min-h-[600px]  dark:bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl">
          What do you do? Tell us your Profession!
        </CardTitle>
        <CardDescription className="text-lg">choose one</CardDescription>
      </CardHeader>
      <CardContent className="">
        <RadioGroup
          value={professionOption} // Bind state to the RadioGroup
          onValueChange={(value) => handleOption(value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 max-w-[600px]" // Trigger handler on change
        >
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r1"
              className={`${
                professionOption === "student" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="student" id="r1" />
              <Image
                src={"/student.png"}
                height={30}
                width={30}
                alt="student"
              />
              Student
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r2"
              className={`${
                professionOption === "employee" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="employee" id="r2" />
              <Image
                src={"/engineer.png"}
                height={30}
                width={30}
                alt="employee"
              />
              Working Employee
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r3"
              className={`${
                professionOption === "graduated" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="graduated" id="r3" />
              <Image
                src={"/graduated.png"}
                height={30}
                width={30}
                alt="graduated"
              />
              Graduated
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r4"
              className={`${
                professionOption === "entreprenuer" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="entreprenuer" id="r4" />
              <Image
                src={"/entrepreneurship.png"}
                height={30}
                width={30}
                alt="entreprenuer"
              />
              Entreprenuer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r5"
              className={`${
                professionOption === "other" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6  min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="other" id="r5" />
              <Image
                src={"/application.png"}
                height={30}
                width={30}
                alt="application"
              />
              Other
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="">
        {professionOption === "other" && (
          <div className="space-y-1">
            <Label htmlFor="other">Other</Label>
            <Input
              id="other"
              className={`rounded-sm border-2 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0 ${
                professionError === "" ? "border-primary-800" : "border-error"
              }`}
              placeholder="Ex:- Youtuber"
              value={profession}
              onChange={(e) => handleOtherProfession(e)}
            />
            {professionError !== "" && (
              <p className="text-error">{professionError}</p>
            )}
          </div>
        )}
      </CardFooter>
      {/* <p className="text-lg block">Selected Option: {profession}</p> */}
    </Card>
  )
}
