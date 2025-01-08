"use client"

import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ReactCountryFlag from "react-country-flag"
import Link from "next/link"

export default function ProfilePopOver() {
  const { user, handleLogout } = useUserContext()

  return (
    <Popover>
      <PopoverTrigger>
        {/* Profile Picture */}
        <Image
          src={user?.personalInfo.photoURL as string}
          height={40}
          width={40}
          alt="profile-photo"
          className="rounded-full cursor-pointer border-2 border-gray-300 hover:border-primary-500 transition"
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-4 w-72 mr-4 space-y-4 shadow-lg rounded-lg bg-neutral-100 text-gray-800">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Image
            src={user?.personalInfo.photoURL as string}
            height={60}
            width={60}
            alt="profile-photo"
            className="rounded-full border border-gray-200 shadow-sm"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-primary-800 underline">
              <Link href={"/profile"}>
              {user?.personalInfo.name}
              </Link>
            </h2>
            <p className="text-sm text-gray-500">
              {user?.personalInfo.username}
            </p>
            <p className="text-sm text-gray-500">{user?.personalInfo.email}</p>
          </div>
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
