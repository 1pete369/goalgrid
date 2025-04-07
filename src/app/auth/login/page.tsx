"use client"

import LoginPage from "@/features/auth/LoginPage"
import SignUpPage from "@/features/auth/SignUpPage"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [isLogin, setIsLogin] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to homepage or dashboard
      router.push("/")
    }
  }, [status, router])

  return (
    <>
      {isLogin ? (
        <LoginPage setIsLogin={setIsLogin} />
      ) : (
        <SignUpPage setIsLogin={setIsLogin} />
      )}
    </>
  )
}
