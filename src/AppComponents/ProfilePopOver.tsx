"use client"

import React, { use, useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ReactCountryFlag from "react-country-flag"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { format, parseISO } from "date-fns"

import { Badge } from "@/components/ui/badge"

export default function ProfilePopOver() {
  const { user } = useUserContext()

  const [badgeColor, setBadgeColor] = useState("gray")

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  useEffect(() => {
    if (user !== null) {
      const getBadgeColor = (plan: string) => {
        switch (plan) {
          case "free":
            return "gray"
          case "personal":
            return "green"
          case "community":
            return "blue"
          case "premium":
            return "yellow"
          case "diamond":
            return "purple"
          default:
            return "gray"
        }
      }
      const color = getBadgeColor(user.customData.subscription)
      setBadgeColor(color)
    }
  }, [user])

  if (user === null) {
    return <p>Loading...</p>
  }

  return (
    <Popover>
      <PopoverTrigger>
        {/* Profile Picture */}
        <Image
          src={user?.personalInfo?.photoURL as string}
          height={40}
          width={40}
          alt="profile-photo"
          className="rounded-full cursor-pointer border-2 border-gray-300 hover:border-primary-500 transition"
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-4 w-72 mr-4 space-y-4 shadow-lg rounded-lg text-gray-800">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Image
            src={user?.personalInfo?.photoURL as string}
            height={60}
            width={60}
            alt="profile-photo"
            className="rounded-full border border-gray-200 shadow-sm"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-primary-800 underline">
              <Link href={"/profile"}>{user?.personalInfo.name}</Link>
            </h2>
            <p className="text-sm text-gray-500">
              {user?.personalInfo.username}
            </p>
            <p className="text-sm text-gray-500">{user?.personalInfo.email}</p>
            <Badge
              className={`${badgeColor === "gray" ? "bg-gray-500" : ""} ${
                badgeColor === "blue" ? "bg-blue-500" : ""
              } ${badgeColor === "yellow" ? "bg-yellow-500" : ""} ${
                badgeColor === "purple" ? "bg-purple-500" : ""
              } max-w-fit`}
            >
              {user?.customData.subscription}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <p className="flex gap-2">
            <span className="font-semibold underline text-sm">CreatedAt:</span>
            <span className="text-slate-600">
              {format(parseISO(user.timings.createdAt), "MMM dd, yyyy hh:mm a")}
            </span>
          </p>
          <p className="flex gap-2">
            <span className="font-semibold underline text-sm">
              LastLoginAt:
            </span>
            <span className="text-slate-600">
              {format(
                parseISO(user.timings.lastLoginAt),
                "MMM dd, yyyy hh:mm a"
              )}
            </span>
          </p>
        </div>

        {/* Country & Timezone */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ReactCountryFlag
              countryCode={user?.customData.timezone.countryCode as string}
              svg
              style={{ width: "24px", height: "24px" }}
              title={user?.customData.timezone.countryCode}
            />
            <span className="text-sm text-gray-700">
              {user?.customData.timezone.timezoneName}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          className="w-full bg-primary-800 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg shadow-md"
          onClick={handleLogout}
        >
          Log Out
        </Button>
        {user?.personalInfo.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href={"/admin/dashboard"}>
            <Button className="w-full bg-accent-blue hover:bg-primary-700 text-white font-semibold py-2 rounded-lg shadow-md">
              Admin DashBoard
            </Button>
          </Link>
        )}
      </PopoverContent>
    </Popover>
  )
}
