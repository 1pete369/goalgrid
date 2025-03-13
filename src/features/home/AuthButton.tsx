"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function AuthButton() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <Link href={isLoggedIn ? "/work" : "/auth/login"}>
      <Button className="relative bg-white hover:bg-neutral-300 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3">
        <span className="bg-gradient-to-tr from-indigo-500 to-cyan-500 text-transparent bg-clip-text font-bold text-lg animate-text">
          {isLoggedIn ? "Go to Workspace" : "Start Your Journey →"}
        </span>
      </Button>
    </Link>
  )
}
