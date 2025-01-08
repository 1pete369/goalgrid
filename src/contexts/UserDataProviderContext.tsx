"use client"

import { auth } from "@/config/firebase"
import { MainUserObject } from "@/types/userTypes"
import { mapFirebaseUserToMainUserObject } from "@/utils/userMappeing"
import {
  checkUser,
  createUser,
  fetchUser,
  onBoardingStatus
} from "@/utils/users"
import { FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth"
import { redirect } from "next/navigation"
import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react"

type UserContextType = {
  user: MainUserObject | null
  handleGoogleLogin: () => Promise<void>
  handleLogout: () => Promise<void>
  handleEmailLogin: (email: string, password: string) => Promise<void>
  handleEmailSignup: (email: string, password: string) => Promise<void>
  profileIsLoading: boolean
  mainError: string
  setMainError: React.Dispatch<SetStateAction<string>>
}

const userContext = createContext<UserContextType | null>(null)

type UserDataProviderContextPropsType = {
  children: React.ReactNode
}

export const UserDataProviderContext = ({
  children
}: UserDataProviderContextPropsType) => {
  const [user, setUser] = useState<MainUserObject | null>(null)
  const [profileIsLoading, setProfileIsLoading] = useState(false)
  const [mainError, setMainError] = useState("")

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEmailSignup = async (email: string, password: string) => {
    try {
      ;(await createUserWithEmailAndPassword(auth, email, password)).user
      setMainError("")
    } catch (error) {
      console.log("Signup Error")
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setMainError("Email already exists!")
            break
          default:
            setMainError("Signup failed, Please try again.")
            break
        }
      } else {
        setMainError("Signup failed, Please try again later.")
      }
    }
  }

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      (await signInWithEmailAndPassword(auth, email, password)).user
      setMainError("")
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            setMainError("Invalid email/password")
            break
          default:
            setMainError("Login failed. Please try again.")
        }
      } else {
        setMainError("An unexpected error occurred. Please try again.")
      }
      console.log("Login error:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !user) { // Avoid refetch if user is already set
        const userExist = await checkUser(firebaseUser.uid);
        if (userExist) {
          setProfileIsLoading(true);
          const MainUserObject = await fetchUser(firebaseUser.uid);
          setUser(MainUserObject); // Persist user in state
          const onBoardingStatusFlag = await onBoardingStatus(firebaseUser.uid);
          if (!onBoardingStatusFlag) {
            redirect("/onboarding");
          }
          setProfileIsLoading(false);
        } else {
          const MainUserObject = await mapFirebaseUserToMainUserObject(firebaseUser);
          setUser(MainUserObject); // Persist new user in state
          await createUser(MainUserObject);
          redirect("/onboarding");
        }
      } else if (!firebaseUser) {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []); // Empty dependency array to run only once on mount
  // Add `user` to the dependency array to run only when `user` changes
  

  return (
    <userContext.Provider
      value={{
        user,
        handleGoogleLogin,
        handleLogout,
        profileIsLoading,
        handleEmailLogin,
        handleEmailSignup,
        mainError,
        setMainError
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(userContext)
  if (context === null) {
    throw new Error("user context must be used within the provider")
  }
  return context
}
