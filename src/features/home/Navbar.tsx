"use client"

import ProfilePopOver from "@/AppComponents/ProfilePopOver"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import GetStarted from "./GetStarted"
import { MobileNavbarSheet } from "./MobileNavbarSheet"
import { navLinks } from "./NavLinks"
import ToggleTheme from "./ToggleTheme"

export default function Navbar() {
  const pathname = usePathname()

  // Hide navbar if the route starts with "/work/"
  if (pathname.startsWith("/work")) return

  return (
    <nav className="w-full fixed top-0 z-50 bg-transparent backdrop-blur-lg border-b border-b-black/30">
      <div className="container  mx-auto text-sm px-4 lg:px-16">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center lg:py-0">
            <Link href={"/"} className="flex flex-shrink-0">
              <Image src={"/logo.png"} alt="logo" height={32} width={32} />
              <span className="font-bold text-lg  lg:text-xl ml-2">
                Your productivity Hub
              </span>
            </Link>
          </div>
          <ul className=" hidden lg:flex lg:items-center ml-14 space-x-4">
            {navLinks.map((navLink, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center px-6 py-2 rounded-sm hover:bg-neutral-100 hover:text-black text-base"
                >
                  <Link href={navLink.link}>{navLink.label}</Link>
                </li>
              )
            })}
          </ul>
          <div className="hidden lg:flex gap-2">
            <GetStarted />
            <ToggleTheme />
          </div>
          <div className="flex items-center gap-4">
            <ProfilePopOver />
            <div className="lg:hidden">
              <MobileNavbarSheet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
