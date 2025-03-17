import { PricingPlan, Subscription } from "@/types/subscriptionTypes"
import { MainUserObject } from "@/types/userTypes"
import axios from "axios"
import { addMonths, format } from "date-fns"
import { useSession } from "next-auth/react"

//   const { data: session, update } = useSession()
// async function updateSubscription() {
//     try {
//       console.log("updating..")
//       await update() // Refresh session manually
//       console.log("updated")
//       console.log("Session updated successfully.")
//     } catch (error) {
//       console.error("Error updating session:", error)
//     }
//   }

const calculateSubscriptionDates = (pricingPlan: PricingPlan) => {
  if (pricingPlan.durationInMonths === null) {
    return { startDate: "", expiryDate: "" }
  }
  const now = new Date()
  const startDate = format(now, "yyyy-MM-dd HH:mm:ss")
  const expiryDate = format(
    addMonths(now, pricingPlan.durationInMonths),
    "yyyy-MM-dd HH:mm:ss"
  )

  return { startDate, expiryDate }
}

export const handleCreateSubscription = async (
  pricingPlan: PricingPlan,
  user: MainUserObject
) => {

  console.log("Create subscription called")

  const { startDate, expiryDate } = calculateSubscriptionDates(pricingPlan)

  const subscription_response = await axios.get(
    `/api/subscriptions/check-subscription-status/${user?.uid}`
  )

  const isSubscriptionCreated = subscription_response.data.isSubscriptionCreated

  if (isSubscriptionCreated) {
  
   const subscriptionStatusUpdatedResponse= await axios.patch(
      `/api/subscriptions/update-subscription-status/${user?.uid}`,
      {
        plan: pricingPlan.plan,
        startDate,
        expiryDate,
        isActive: true,
        billingCycle: pricingPlan.billingCycle,
        durationInMonths : pricingPlan.durationInMonths
      }
    )

    console.log("subscriptionStatusUpdatedResponse",subscriptionStatusUpdatedResponse.data)


    const userSubscriptionStatusUpdatedResponse = await axios.patch(`/api/users/update-subscription-status/${user?.uid}`,{ plan: pricingPlan.plan })

    console.log("userSubscriptionStatusUpdatedResponse.data",userSubscriptionStatusUpdatedResponse.data)

  } else {
    const subscriptionObject: Subscription = {
      id: crypto.randomUUID(),
      uid: user?.uid!,
      plan: pricingPlan.plan,
      startDate,
      expiryDate,
      isActive: true,
      durationInMonths: pricingPlan.durationInMonths,
      billingCycle: pricingPlan.billingCycle
    }

    console.log("subscriptionObject", subscriptionObject)

    // await axios.post(
    //   `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-subscription`,
    //   { subscriptionObject }
    // )

    const subscriptionCreateResponse= await axios.post('/api/subscriptions/create-subscription',{subscriptionObject})

    console.log("subscriptionCreateResponse.data",subscriptionCreateResponse.data)

    // await axios.patch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/users/update-subscription-status/${user?.uid}`,
    //   { plan: pricingPlan.plan }
    // )

    const userSubscriptionStatusUpdatedResponse = await axios.patch(`/api/users/update-subscription-status/${user?.uid}`,{ plan: pricingPlan.plan })

    console.log("userSubscriptionStatusUpdatedResponse.data",userSubscriptionStatusUpdatedResponse.data)

    // await updateSubscription()

    // setIsPurchasing(false)
  }
}
