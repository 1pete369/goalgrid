"use client"

import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function GetStarted() {
  const { user } = useUserContext()

  if (user === null)
    return (
      <Link href={"/auth/login"}>
        <Button className="bg-black hover:bg-black text-white dark:bg-white dark:text-black">
          Get Started <ArrowRight />
        </Button>
      </Link>
    )
}
