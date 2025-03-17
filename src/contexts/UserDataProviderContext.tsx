"use client"
// context/UserContext.tsx
import { differenceInHours, parseISO } from "date-fns";
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
import { handleCreateSubscription } from "@/features/pricing/PricingPlanAction";
import { PricingPlan } from "@/types/subscriptionTypes";

interface UserContextType {
  user: MainUserObject | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { data: session } = useSession() // NextAuth session
  const [user, setUser] = useState<MainUserObject | null>(null)
  const [loading, setLoading] = useState(true)

  const baseSubscriptionPlan = {
    title: "Free",
    plan: "free",
    price: 0,
    billingCycle: null,
    description: "Kickstart your productivity journey—no cost",
    features: [
      "Task & habit tracking",
      "10 journal entries per month",
      "Weekly progress insights",
      "Simple, distraction-free dashboard"
    ],
    durationInMonths: 1,
    isPopular: false
  }


  const shouldUpdateLastLogin = (lastLoginAt?: string) => {
    if (!lastLoginAt) return true; // If lastLoginAt is missing, update it
    return differenceInHours(new Date(), parseISO(lastLoginAt)) >= 1; // Update only if 1 hour has passed
  };
  
  const fetchUserData = async () => {
    if (!session?.user?.id) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
  
    const userExist = await checkUser(session.user.id);
    if (userExist) {
      let MainUserObject : MainUserObject = await fetchUser(session.user.id);
      
      // Only update last login if 1 hour has passed
      if (shouldUpdateLastLogin(MainUserObject.timings?.lastLoginAt)) {
        MainUserObject = {
          ...MainUserObject,
          timings: {
            ...MainUserObject.timings,
            lastLoginAt: new Date().toISOString(),
          },
        };
        setUser(MainUserObject);
        await updateLastLogin(session.user.id);
      } else {
        setUser(MainUserObject);
      }
  
      const onBoardingStatusFlag = MainUserObject.isOnboardingComplete

      if (!onBoardingStatusFlag) {
        redirect("/onboarding");
      }
    } else {
      const { id, accountVerified, email, image, name, provider } = session.user;
      if (id && accountVerified !== undefined && email && image && name && provider) {
        const MainUserObject = await mapFirebaseUserToMainUserObject(
          id, email, image, name, provider, accountVerified
        );
        console.log("User Object Created", MainUserObject);
        setUser(MainUserObject);
        await createUser(MainUserObject);
        await handleCreateSubscription(baseSubscriptionPlan as PricingPlan,MainUserObject)

        redirect("/onboarding");
      }
    }
  
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [session]); // Runs when session updates (refresh or login)

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext)
