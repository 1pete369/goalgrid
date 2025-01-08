"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword
} from "@/utils/validators/authFormValidators"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function SignUpWithEmail() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPassworError, setConfirmPasswordError] = useState("")

  const { mainError, setMainError, handleEmailSignup } = useUserContext()

  useEffect(() => {
    setMainError("")
  }, [])

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const email = e.target.value
    setEmail(email)
    const error = validateEmail(email)
    if (error !== "") {
      setEmailError(error)
    } else {
      setEmailError(error)
    }
  }
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const password = e.target.value
    setPassword(password)
    const error = validatePassword(password)
    if (error !== "") {
      setPasswordError(error)
    } else {
      setPasswordError(error)
    }
  }

  const handleConfrimPassword = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const confirmPassword = e.target.value
    setConfirmPassword(confirmPassword)
    const error = validateConfirmPassword(password, confirmPassword)
    if (error !== "") {
      setConfirmPasswordError(error)
    } else {
      setConfirmPasswordError(error)
    }
  }

  const handleSignUpWithEmail = async (e: FormEvent) => {
    e.preventDefault()
    await handleEmailSignup(email, password)
  }

  return (
    <div className="">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSignUpWithEmail}
      >
        <div>
          <label htmlFor="email" className="hidden">
            Email:
          </label>
          <input
            required
            type="email"
            id="email"
            className="rounded-sm border-2 border-solid border-black/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black min-w-60"
            placeholder="Enter email"
            value={email}
            onChange={(e) => handleEmail(e)}
          />
          {emailError !== "" && (
            <p className="text-error text-sm">{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="hidden">
            Password:
          </label>
          <input
            required
            type="password"
            id="password"
            className="rounded-sm border-2 border-solid border-black/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black min-w-60"
            placeholder="Enter password"
            value={password}
            onChange={(e) => handlePassword(e)}
          />
          {passwordError !== "" && (
            <p className="text-error text-sm">{passwordError}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirm password" className="hidden">
            Confirm Password:
          </label>
          <input
            required
            type="password"
            id="confirm password"
            className="rounded-sm border-2 border-solid border-black/30 focus-within:border-primary-800 outline-none px-2 py-1.5 placeholder:text-neutral-500 text-black min-w-60"
            placeholder="Enter password Again"
            value={confirmPassword}
            onChange={(e) => handleConfrimPassword(e)}
          />
          {confirmPassworError !== "" && (
            <p className="text-error text-sm">{confirmPassworError}</p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 w-full bg-primary-800 text-white rounded-full hover:bg-primary-500 focus:ring-2 focus:ring-black focus:outline-none transition-all min-w-[240px]"
        >
          Signup
        </button>
        {mainError !== "" && (
          <p className="text-error text-sm mt-1">{mainError}</p>
        )}
      </form>
    </div>
  )
}
