"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function Navbar({
  isMenuOpen,
  setIsMenuOpen
}: {
  isMenuOpen: boolean
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [path, setPath] = useState<string | null>(null)
  const pathname = usePathname()
  const { data: session } = useSession() // Retrieve session data
  const user = session?.user // Get the user object from the session

  useEffect(() => {
    const pathName = pathname.split("/")[1]
    if (pathName !== path) {
      setPath(pathName) // Only update if path has changed
    }
    setIsMenuOpen(false)
  }, [pathname, path, setIsMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto" // Clean up on unmount or menu close
    }
  }, [isMenuOpen]) // Only trigger when isMenuOpen changes

  return (
    <div className="text-black">
      <div className="hidden md:block">
        <ul className="flex gap-4">
          <li>
            <Link
              href={"/"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === ""
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={"/work"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === "work"
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href={"/donate"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === "donate"
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Donate
            </Link>
          </li>
          <li>
            <Link
              href={"/feedback"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === "feedback"
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Feedback
            </Link>
          </li>
          <li>
            <Link
              href={"/pricing"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === "pricing"
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href={"/friends"}
              className={`inline-block px-4 py-1.5 rounded ${
                path === "friends"
                  ? "underline"
                  : "hover:text-primary-500 hover:underline"
              }`}
            >
              Friends
            </Link>
          </li>
          {!user && (
            <li>
              <Link href={"/auth/login"}>
                <button className="text-white inline-block px-4 py-1.5 rounded-full bg-primary-800">
                  Get started
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-white h-screen w-full overflow-y-auto shadow-lg space-y-4 p-10 border-solid border-t-primary-500 border-t-2 box-border outline-none">
          <ul className="flex flex-col items-center gap-10">
            <li>
              <Link
                href={"/"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === ""
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/work"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === "work"
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Work
              </Link>
            </li>
            <li>
              <Link
                href={"/donate"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === "donate"
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Donate
              </Link>
            </li>
            <li>
              <Link
                href={"/feedback"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === "feedback"
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link
                href={"/pricing"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === "pricing"
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href={"/friends"}
                className={`inline-block px-4 py-1.5 rounded ${
                  path === "friends"
                    ? "underline"
                    : "hover:text-primary-500 hover:underline"
                }`}
              >
                Friends
              </Link>
            </li>
            {!user && (
              <li>
                <Link href={"/auth/login"}>
                  <button className="text-white inline-block px-4 py-1.5 rounded-full bg-primary-800">
                    Get started
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
