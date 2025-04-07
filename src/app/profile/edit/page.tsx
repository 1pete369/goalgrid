"use client"

import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { validateEmail, validatePassword } from "@/utils/validators/authFormValidators"
import React, { ChangeEvent, useState } from "react"

export default function page() {
  const { user } = useUserContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const email = e.target.value
    setEmail(email)
    const error = validateEmail(email)
    setEmailError(error)
  }

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const password = e.target.value.trim()
    setPassword(password)
    const error = validatePassword(password)
    setPasswordError(error)
  }

  if (user === null) return <FullPageLoading />
  return (
    <div className="container min-h-screen md:px-16 p-4 pt-20">
      <h1 className="text-xl font-semibold">Edit Profile</h1>
      Edit
    </div>
  )
}
