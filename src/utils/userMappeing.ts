import { MainUserObject } from "@/types/userTypes"
import { getTimeZoneAndCountryCode } from "./timeZone"



export const mapFirebaseUserToMainUserObject = async (
  id: string,
  email: string ,
  image: string ,
  name: string ,
  provider: string,
  accountVerified: boolean
) => {
  const placeHoldForUserName = `_${crypto.randomUUID().slice(1, 10)}`

  const data=getTimeZoneAndCountryCode()

  const MainUserObject: MainUserObject = {
    uid: id,
    personalInfo: {
      email: email as string || "",
      name: name!=="" ? name?.toLowerCase()!  : "",
      username: name!==""
        ? name?.replace(/\s+/g, "")
            .toLowerCase()
            .concat(placeHoldForUserName)!
        : "",
      photoURL: name!==""
        ? image as string
        : `https://picsum.photos/seed/${id}/200`,
      provider: provider==="google"
          ? "google"
          : "credentials",
      isEmailVerified: accountVerified,
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
      days: [],
      friends : [],
      subscription : "free"
    },
    updates: {
      profileUpdatedAt: new Date()
    },
    timings: {
      createdAt: new Date().toISOString()!,
      lastLoginAt: new Date().toISOString()!
    }
  }

  return MainUserObject
}
