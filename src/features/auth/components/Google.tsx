"use client"

import { signIn } from "next-auth/react"
import Image from "next/image"
import React from "react"
import { useRouter } from "next/navigation"

export default function GoogleLogin() {
  const router = useRouter() // Next.js router for navigation

  const handleLogin = async () => {
    try {
      const result = await signIn("google", { redirect: false })
      if (result?.error) {
        console.error("Google sign-in failed:", result.error)
      } else {
        const callbackUrl = result?.url || "/"
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error("Error during Google login:", error)
    }
  }

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 border-primary-800 border-2 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition-all min-w-[240px]"
      onClick={handleLogin}
    >
      <Image src={"/google.png"} height={20} width={20} alt="Google" />
      Continue with Google
    </button>
  )
}
