"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

type UserProfile = {
  uid: string
  name: string
  username: string
  photoURL: string
}

type UserProfileContextType = {
  getUserProfile: (uid: string) => UserProfile | undefined
  loadUserProfiles: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | null>(null)

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({})

  const loadUserProfiles = async () => {
    try {
      const { allUsers : data } = await (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get-all-users`)).data
      console.log(data)
      const profiles = Array.isArray(data) && data.reduce((acc: Record<string, UserProfile>, user: UserProfile) => {
        acc[user.uid] = user
        return acc
      }, {})
      setUserProfiles(profiles)
    } catch (error) {
      console.error("Error fetching user profiles:", error)
    }
  }

  const getUserProfile = (uid: string) => userProfiles[uid]

  useEffect(() => {
    loadUserProfiles()
  }, [])

  return (
    <UserProfileContext.Provider value={{ getUserProfile, loadUserProfiles }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider")
  }
  return context
}
