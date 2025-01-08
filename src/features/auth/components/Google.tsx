"use client"

import { useUserContext } from '@/contexts/UserDataProviderContext'
import Image from 'next/image'
import React from 'react'

export default function Google() {

  const { handleGoogleLogin } = useUserContext()

  return <button className='flex items-center gap-2 px-4 py-2 border-primary-800 border-2  rounded-full focus:ring-2 focus:ring-black focus:outline-none transition-all min-w-[240px]'
  onClick={handleGoogleLogin}> 
    <Image src={"/google.png"} height={20} width={20} alt='Google'/>
    Continue with Google
    </button>
}

