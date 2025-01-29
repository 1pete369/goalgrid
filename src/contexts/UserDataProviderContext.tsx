"use client"
// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { MainUserObject } from "@/types/userTypes"
import {
  checkUser,
  createUser,
  fetchUser,
  onBoardingStatus,
  updateLastLogin
} from "@/utils/users"
import { redirect } from "next/navigation"
import { mapFirebaseUserToMainUserObject } from "@/utils/userMappeing"

interface UserContextType {
  user: MainUserObject | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { data: session } = useSession() // NextAuth session
  const [user, setUser] = useState<MainUserObject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user && user !== null) return

      if (session?.user?.id) {
        const userExist = await checkUser(session.user.id)
        if (userExist) {
          setLoading(true)
          let MainUserObject = await fetchUser(session.user.id)
          MainUserObject = {
            ...MainUserObject,
            timings: {
              ...MainUserObject.timings,
              lastLoginAt: new Date().toISOString()
            }
          }
          setUser(MainUserObject)
          await updateLastLogin(session.user.id)
          const onBoardingStatusFlag = await onBoardingStatus(session.user.id)
          if (!onBoardingStatusFlag) {
            redirect("/onboarding")
          }
          setLoading(false)
        } else {
          if (
            session.user.id != null &&
            session.user.accountVerified != null &&
            session.user.email != null &&
            session.user.image != null &&
            session.user.name != null &&
            session.user.provider != null
          ) {
            // All fields are neither null nor undefined
            const MainUserObject = await mapFirebaseUserToMainUserObject(
              session.user.id,
              session.user.email,
              session.user.image,
              session.user.name,
              session.user.provider,
              session.user.accountVerified
            )
            console.log("User Object Created", MainUserObject)
            setUser(MainUserObject)
            await createUser(MainUserObject)
            redirect("/onboarding")
          }
        }
      } else {
        setUser(null)
      }
    }

    fetchUserData()
  }, [session])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext)
