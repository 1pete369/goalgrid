import { MainUserObject } from "@/types/userTypes"
import { User as FirebaseUser } from "firebase/auth"
import { getTimeZoneAndCountryCode } from "./timeZone"

export const mapFirebaseUserToMainUserObject = async (
  firebaseUser: FirebaseUser
) => {
  const placeHoldForUserName = `_${crypto.randomUUID().slice(1, 10)}`

  const data=getTimeZoneAndCountryCode()

  const isGoogleProvider =
    firebaseUser.providerData[0].providerId === "google.com" ? true : false

  const MainUserObject: MainUserObject = {
    uid: firebaseUser.uid,
    personalInfo: {
      email: firebaseUser.email || "",
      name: isGoogleProvider ? firebaseUser.displayName?.toLowerCase()! : "",
      username: isGoogleProvider
        ? firebaseUser.displayName
            ?.replace(/\s+/g, "")
            .toLowerCase()
            .concat(placeHoldForUserName)!
        : "",
      photoURL: isGoogleProvider
        ? firebaseUser.photoURL as string
        : `https://picsum.photos/seed/${firebaseUser.uid}/200`,
      provider: isGoogleProvider
          ? "google"
          : "email",
      isEmailVerified: firebaseUser.emailVerified,
      dob: "",
      profession: "",
      intendedUseCases: [],
      referralSource: "",
      gender: ""
    },
    isOnboardingComplete: false,
    customData: {
      timezone: {
        timezoneName: data.timezone,
        countryCode: data.countryCode
      },
      preferences: {
        notification: false
      },
      streak: 0,
      goals: [],
      days: []
    },
    updates: {
      profileUpdatedAt: new Date()
    },
    timings: {
      createdAt: firebaseUser.metadata.creationTime!,
      lastLoginAt: firebaseUser.metadata.lastSignInTime!
    }
  }

  return MainUserObject
}
