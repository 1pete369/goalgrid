"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import ReactCountryFlag from "react-country-flag"
import { signOut } from "next-auth/react"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { formatDate } from "@/utils/basics"
import { format, parseISO } from "date-fns"
import { usePathname } from "next/navigation"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export default function Page() {
  const { user, loading } = useUserContext()

  const handleLogout = async () => {
    await signOut({ redirect: false })
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="  min-h-screen ">
      <div className="relative h-40">
        <Image
          src={"/gradient.png"}
          height={0}
          width={0}
          className="absolute object-cover h-full w-full z-10 shadow-md"
          alt="cover_image"
        />
        <Image
          src={user.personalInfo.photoURL}
          height={90}
          width={90}
          alt="profile_image"
          className="absolute top-[100%] -translate-y-1/2 z-10 translate-x-4 md:translate-x-16 rounded-full shadow-md"
        />
      </div>
      <section className="px-4 md:px-16 ">
        <div className="mt-12 flex flex-col gap-1 md:gap-2">
          <div className="flex gap-4 items-center">
            <p className="text-xl">
              {user.personalInfo.name.toLocaleUpperCase()}
            </p>
            <ReactCountryFlag
              countryCode={user.customData.timezone.countryCode}
              svg
              style={{ width: "20px", height: "20px" }}
              title="United States"
            />
          </div>
          <p className="dark:text-slate-400 text-slate-900">
            {user.personalInfo.username}
          </p>
          <p className="dark:text-slate-400 text-slate-900">
            i want to become financial free and travel the world!
          </p>
        </div>
        <div className="mt-2  flex gap-1 items-center ">
          <p>{user.progress.tokens}</p>
          <Image
            height={16}
            width={16}
            src={"/coin1.png"}
            alt="rewards"
            className="w-5 h-5 flex-shrink-0"
          />
        </div>
        <div className="mt-2  ">
          <Link href={"/profile/edit"} className="">
            <Button>
              <Pencil /> Edit profile
            </Button>
          </Link>
        </div>
        <hr className="mt-2" />
        <div className="mt-2 ">
          <p className="text-xl font-semibold">Badges Earned</p>
          <p>No badges yet!</p>
        </div>
      </section>
    </div>
  )
}
