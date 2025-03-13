// import { Subscription } from "@/types/subscriptionTypes"
// import axios from "axios"

// export const createSubscription = async (subscriptionObject: Subscription) => {
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-subscription`,
//       { subscriptionObject }
//     )
//     console.log(response.data)
//     // const subscriptionObjectCreated = response.data.subscriptionObjectCreated
//     // const _id = subscriptionObjectCreated

//     // const response2 = await axios.patch(
//     //   `${process.env.NEXT_PUBLIC_API_URL}/users/push-subscription-id/${subscriptionObject.uid}`,
//     //   { _id }
//     // )

//     // console.log(response2.data)
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const checkSubscriptionStatus = async (uid: string) => {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/check-subscription-status/${uid}`
//     )
//     console.log(response.data)
//     return response.data.status
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const updateSubscriptionStatus = async (
//   subscriptionObject: Subscription
// ) => {
//   try {
//     const { plan, startDate, expiryDate, isActive } = subscriptionObject
//     const response = await axios.patch(
//       `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/update-subscription-status/${subscriptionObject.uid}`,
//       {
//         plan,
//         startDate,
//         expiryDate,
//         isActive
//       }
//     )

//     console.log(response.data)
//   } catch (error) {
//     console.log(error)
//   }
// }
