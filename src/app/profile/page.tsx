
"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import ReactCountryFlag from "react-country-flag"
import { useUserContext } from "@/contexts/UserDataProviderContext"

export default function Page() {
  const { user, handleLogout, profileIsLoading } = useUserContext()

  return (
    <div className="text-lg p-4 w-full space-y-2">
      <span className="text-xl font-semibold">Profile page</span>
      {user === null ? (
        profileIsLoading ? (
          <p>Loading...</p>
        ) : (
          <p>User not logged in!</p>
        )
      ) : (
        <div className="flex flex-col gap-10 justify-between p-4 shadow-md rounded-sm max-w-lg border-2 border-solid box-border ">
          <div className="flex gap-1 flex-col leading-8">
            <div className=" flex justify-between mr-6">
              <h2 className="underline">User Details</h2>
              <div className="h-10 overflow-hidden">
                {user.personalInfo?.photoURL && (
                  <Image
                    src={user.personalInfo.photoURL}
                    width={40}
                    height={40}
                    className="rounded-sm"
                    alt="User profile picture"
                  />
                )}
              </div>
            </div>
            <p className="flex gap-2">
              <span className=" font-semibold underline">UserName:</span>
              <span className=" text-slate-600 ">
                {user.personalInfo?.username}
              </span>
            </p>
            <p className="flex gap-2">
              <span className=" font-semibold underline">DisplayName:</span>
              <span className=" text-slate-600 ">
                {user.personalInfo?.name}
              </span>
            </p>
            <p className="flex gap-2">
              <span className=" font-semibold underline">Email:</span>
              <span className=" text-slate-600 ">
                {user.personalInfo?.email}
              </span>
            </p>
            {/* <p className="flex gap-2"><span className=" font-semibold underline">Uid:</span><span className=" text-slate-600 ">{user.personalInfo?.uid}</span></p> */}
            <p className="flex gap-2">
              <span className=" font-semibold underline">Provider:</span>
              <span className=" text-slate-600 ">
                {user.personalInfo?.provider}
              </span>
            </p>
            {/* <p className="flex gap-2">
              <span className=" font-semibold underline">CreatedAt:</span>
              <span className=" text-slate-600 ">
                {formatDate(user.timings.createdAt)}
              </span>
            </p>
            <p className="flex gap-2">
              <span className=" font-semibold underline">LastLoginAt:</span>
              <span className=" text-slate-600 ">
                {formatDate(user.timings.lastLoginAt)}
              </span>
            </p> */}
            <p className="flex gap-2">
              <span className=" font-semibold underline">TimeZone:</span>
              <span className=" text-slate-600 ">
                {user.customData.timezone.timezoneName}
              </span>
            </p>
            <p className="flex gap-2 items-center">
              <span className=" font-semibold underline">Country:</span>
              <ReactCountryFlag
                countryCode={user.customData.timezone.countryCode}
                svg
                style={{ width: "20px", height: "20px" }}
                title="United States"
              />
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                className="bg-slate-800 p-2.5 min-w-[200px] max-w-[200px] rounded text-white text-lg text-center shadow-md"
                onClick={handleLogout}
              >
                Logout
              </button>
              <Link href={"/profile/edit-profile"}>
                <button className="bg-sky-400 p-2.5 min-w-[200px] max-w-[200px] rounded text-white text-lg text-center shadow-md">
                  Edit
                </button>
              </Link>
              {user.personalInfo?.email ===
                process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <Link href={"/admin/dashboard"}>
                  <button className="bg-teal-500 p-2.5 min-w-[200px] max-w-[200px] rounded text-white text-lg text-center shadow-md">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
          {/* <Image src={"/svgviewer-output.svg"} alt="Grid Logo" width={600} height={200} />
          <img src="/grid.svg" alt="Grid Logo" width="600" height="200" loading="lazy" decoding="async" /> */}
        </div>
      )}
    </div>
  )
}
