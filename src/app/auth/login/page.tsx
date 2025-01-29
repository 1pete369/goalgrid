"use client"

import LoginPage from "@/features/auth/LoginPage"
import SignUpPage from "@/features/auth/SignUpPage"
import { useState } from "react"

export default function Page() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <>
    {isLogin ? 
      <LoginPage setIsLogin={setIsLogin}/>:
      <SignUpPage setIsLogin={setIsLogin}/>
    }
    </>
  )
}
