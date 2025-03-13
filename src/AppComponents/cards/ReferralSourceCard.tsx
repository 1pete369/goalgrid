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
import { validateReferralSource } from "@/utils/validators/onBoardingValidators"
import Image from "next/image"
import React, { ChangeEvent, SetStateAction } from "react"

type ReferralSourceCardPropsType = {
  referralSource: string
  setReferralSource: React.Dispatch<SetStateAction<string>>
  referralSourceOption: string
  setReferralSourceOption: React.Dispatch<SetStateAction<string>>
  referralSourceError: string
  setReferralSourceError: React.Dispatch<SetStateAction<string>>
}

export default function ReferralSourceCard({
  referralSource,
  referralSourceError,
  referralSourceOption,
  setReferralSource,
  setReferralSourceError,
  setReferralSourceOption
}: ReferralSourceCardPropsType) {
  
  const handleOtherReferralSource = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const profession = e.target.value
    console.log("Typed profession:", profession)
    setReferralSource(profession)
    const error = validateReferralSource(profession)
    if (error !== "") {
      setReferralSourceError(error)
    } else {
      setReferralSourceError(error)
    }
  }

  const handleOption = (value: string) => {
    const option = value
    console.log("OPtion", option)
    setReferralSourceOption(option)
    if (option !== "other") {
      setReferralSource(option)
      setReferralSourceError("")
    } else {
      setReferralSource("")
    }
  }

  return (
    <Card className="w-full border-none shadow-none min-h-[600px] dark:bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl">
          Where are you from? How did you hear about the app?
        </CardTitle>
        <CardDescription className="text-lg">choose one</CardDescription>
      </CardHeader>
      <CardContent className="">
        <RadioGroup
          value={referralSourceOption} // Bind state to the RadioGroup
          onValueChange={handleOption}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 max-w-[600px]" // Trigger handler on change
        >
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r1"
              className={`${
                referralSourceOption === "youtube" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6   min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="youtube" id="r1" />
              <Image
                src={"/youtube.png"}
                height={30}
                width={30}
                alt="youtube"
              />
              YouTube
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r2"
              className={`${
                referralSourceOption === "instagram" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6   min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="instagram" id="r2" />
              <Image
                src={"/instagram.png"}
                height={30}
                width={30}
                alt="instagram"
              />
              Instagram
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r3"
              className={`${
                referralSourceOption === "google" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6   min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem className="hidden" value="google" id="r3" />
              <Image src={"/google.png"} height={30} width={30} alt="google" />
              Google
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r4"
              className={`${
                referralSourceOption === "friends/family" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6   min-w-[200px] flex items-center gap-2  border-2`}
            >
              <RadioGroupItem
                className="hidden"
                value="friends/family"
                id="r4"
              />
              <Image src={"/friend.png"} height={30} width={30} alt="friend" />
              Friends/familiy
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="r5"
              className={`${
                referralSourceOption === "other" &&
                "border-2 border-primary-800 box-border"
              } rounded-sm px-4 py-6   min-w-[200px] flex items-center gap-2  border-2`}
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
        {referralSourceOption === "other" && (
          <div className="space-y-1">
            <Label htmlFor="username">Other-platform</Label>
            <Input
              id="other-platform"
              className={`rounded-sm border-2 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0 ${
                referralSourceError === ""
                  ? "border-primary-800"
                  : "border-error"
              }`}
              placeholder="Ex:- Blog post"
              value={referralSource}
              onChange={(e) => handleOtherReferralSource(e)}
            />
            {referralSourceError !== "" && (
              <p className="text-error">{referralSourceError}</p>
            )}
          </div>
        )}
      </CardFooter>
      {/* <p className="text-lg block">Selected Option: {selectedValue}</p> */}
    </Card>
  )
}
