"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  validateDob,
  validateName,
  validateUserName
} from "@/utils/validators/onBoardingValidators"
import Image from "next/image"
import React, { ChangeEvent } from "react"

type GetStartedCardPropsType = {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  nameError: string
  setNameError: React.Dispatch<React.SetStateAction<string>>
  username: string
  setUsername: React.Dispatch<React.SetStateAction<string>>
  dob: string
  setDob: React.Dispatch<React.SetStateAction<string>>
  gender: string
  setGender: React.Dispatch<React.SetStateAction<string>>
  usernameError: string
  setUsernameError: React.Dispatch<React.SetStateAction<string>>
  dobError: string
  setDobError: React.Dispatch<React.SetStateAction<string>>
}

export default function GetStartedCard({
  name,
  setName,
  nameError,
  setNameError,
  username,
  setUsername,
  gender,
  setGender,
  dob,
  setDob,
  usernameError,
  setUsernameError,
  dobError,
  setDobError
}: GetStartedCardPropsType) {
  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newName = e.target.value
    setName(newName)
    const error = validateName(newName.trim())
    if (error !== "") {
      setNameError(error)
    } else {
      setNameError("")
    }
  }

  const handleUsername = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newUserName = e.target.value.trim()
    setUsername(newUserName.toLowerCase())
    const error =await validateUserName(newUserName.trim())
    
    if (error !== "") {
      setUsernameError(error)
    } else {
      setUsernameError("")
    }
  }

  const handleDob = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newDob = e.target.value
    setDob(newDob)
    const error = validateDob(newDob)
    if (error !== "") {
      setDobError(error)
    } else {
      setDobError("")
    }
  }

  const handleGender = (gender: string) => {
    console.log(gender)
    setGender(gender)
  }

  return (
    <Card className="w-full border-none shadow-none min-h-[600px]">
      <CardHeader>
        <CardTitle className="text-2xl">Let's Get Started!!</CardTitle>
        <CardDescription className="text-lg">
          Tell us more about yourself!
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 max-w-[600px]">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className={`rounded-sm border-2 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0 ${
              nameError === "" ? "border-primary-800" : "border-error"
            }`}
            placeholder="Enter name"
            value={name}
            onChange={(e) => handleName(e)}
          />
          {nameError !== "" && (
            <p className="text-sm text-error">{nameError}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            className={`placeholder:normal-case lowercase rounded-sm border-2 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0 ${
              usernameError === "" ? "border-primary-800" : "border-error"
            }`}
            placeholder="Enter username"
            value={username}
            onChange={(e) => handleUsername(e)}
          />
          {usernameError !== "" && (
            <p className="text-sm text-error">{usernameError}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="date-of-birth">Date of Birth</Label>
          <Input
            type="date"
            id="date-of-birth"
            value={dob}
            onChange={(e) => handleDob(e)}
            className={`rounded-sm border-2 outline-none pr-0 py-1.5 placeholder:text-neutral-500 text-black w-60 ring-0 focus-visible:ring-0 text-sm ${
              dobError === "" ? "border-primary-800" : "border-error"
            }`}
          />
          {dobError !== "" && <p className="text-sm text-error">{dobError}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            value={gender} // Bind state to the RadioGroup
            onValueChange={(value) => handleGender(value)}
            className="flex"
          >
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="r1"
                className={`${
                  gender === "male" && "border-2 border-primary-800 box-border"
                } rounded-sm px-4 py-1 w-[116px] flex items-center gap-2 hover:scale-105 transition-all hover:shadow-lg border-2`}
              >
                <RadioGroupItem className="hidden" value="male" id="r1" />
                <Image src={"/male.png"} height={25} width={25} alt="male" />
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="r2"
                className={`${
                  gender === "female" &&
                  "border-2 border-primary-800 box-border"
                } rounded-sm px-4 py-1 w-[116px] flex items-center gap-2 hover:scale-105 transition-all hover:shadow-lg border-2`}
              >
                <RadioGroupItem className="hidden" value="female" id="r2" />
                <Image
                  src={"/female.png"}
                  height={25}
                  width={25}
                  alt="female"
                />
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
