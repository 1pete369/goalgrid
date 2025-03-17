import axios from "axios"

export type sessionUserType = {
  id: string
  email: string | null // email is required but can be null
  image: string | null // image is required but can be null
  name: string | null // name is required but can be null
  provider: string
  accountVerified: boolean
}

export type credentialsUserType = {
  id: string
  email: string
  image: string
  name: string
  provider: string
  accountVerified: boolean
  hashedPassword: string
}

export const createUserCredentials = async (
  newCredentialUserObject: sessionUserType
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/credentials/create-credential-user`,
      { newCredentialUserObject }
    )
    console.log("Creating credentials user")
    return response.data.user
  } catch (error) {
    console.error("Error creating user credentials:", error)
    return null
  }
}

export const findUserByEmail = async (email: string) => {
  try {
    console.log("Finding by email called")
    console.log("Email is",email)
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/credentials/find-by-email/${email}`)
    console.log("Data from find by email", response.data)
    return response.data
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

export const fetchUserSubscription = async (uid: string) => {
  try {
    console.log("subscription plan fetching")
    const subscriptionResponse = await axios.get(
      `${process.env.NEXTAUTH_URL}/api/subscriptions/check-subscription-status/${uid}`
    )
    // Check if no subscription was found
    if (subscriptionResponse.data.message === "No Subscription found") {
      return "free" // Return default "free" plan
    }

    // Return the plan as a string (it should already be a string)
    const subscriptionPlan = subscriptionResponse.data?.plan || "free" // Default to "free"
    console.log("subscription plan fetched", subscriptionPlan)
    return subscriptionPlan
  } catch (error) {
    console.error(error)
    return "free" // Return default "free" plan in case of an error
  }
}
