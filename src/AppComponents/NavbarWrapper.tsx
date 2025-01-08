"use client"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Navbar from "./Navbar"
import ProfilePopOver from "./ProfilePopOver"

export default function NavbarWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {user} = useUserContext()

  const pathName = usePathname()

  const canNavbarSet = pathName.split("/")[1]==="work"

  if (canNavbarSet) {
    return null;  // Ensures nothing is rendered if the route is "/work"
  }

  return (
    <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm backdrop:bg-white/10 text-neutral-300">
      <div className=" container mx-auto p-4 md:px-24 flex justify-between items-center">
        <div className="flex gap-1">
          <button
            className="md:hidden p-1 bg-black rounded-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Image
              src={"/menu.svg"}
              className="text-white"
              height={18}
              width={18}
              alt="Menu"
            />
          </button>
          <Image
            src="/logo.png"
            className="object-contain" // Prevent distortion and maintain aspect ratio
            height={25}
            width={25}
            alt="Logo"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          {
            user && 
          <ProfilePopOver />
          }
        </div>
      </div>
    </div>
  )
}
