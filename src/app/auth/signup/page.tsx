"use client"

import { useUserContext } from '@/contexts/UserDataProviderContext'
import SignUpPage from '@/features/auth/SignUpPage'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

export default function page() {
   const {user} = useUserContext()
    useEffect(()=>{
      if(user!==null){
        redirect('/')
      }
    },[user])
  return <SignUpPage />
}
