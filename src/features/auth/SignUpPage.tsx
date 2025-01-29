import React, { SetStateAction } from 'react'
import SignUpWithEmail from './components/SignUpWithEmail'
import Image from 'next/image'
import Google from './components/Google'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpPage({
  setIsLogin
}: {
  setIsLogin: React.Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-75px)]">
      <div className="flex flex-col gap-5 items-center justify-center border-2 p-10 rounded">
        <h1 className="text-xl text-primary-800 underline font-semibold">
          Create Account!
        </h1>
        <SignUpWithEmail />
        <div className="flex justify-between gap-5">
          <Image
            src={"/line.png"}
            className=" rotate-45"
            height={10}
            width={40}
            alt="line"
          />
          <span className="mt-1.5">or</span>
          <Image
            src={"/line.png"}
            className=" rotate-45"
            height={10}
            width={40}
            alt="line"
          />
        </div>
        <Google />
        <div className="text-">
          already have an account?{" "}
          <Button onClick={()=>setIsLogin(true)} className="text-primary-800 underline bg-transparent shadow-none hover:bg-transparent hover:shadow-none">
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
