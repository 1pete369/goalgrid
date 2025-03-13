import { ApiResponse } from "@/types/apiErrorType"
import { MainUserObject, onBoardingDataType } from "@/types/userTypes"
import axios from "axios"
import { handleApiError } from "./handleApiError"

// export async function checkUser(uid: string) {
//   try {
//     const response = (
//       await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/check-user/${uid}`
//       )
//     ).data
//     return response.exist
//   } catch (error) {
//     console.log(error)
//   }
// }

export async function checkUser(uid: string){
  try {
    const response = await axios.get(`/api/users/check-user/${uid}`)
    return response.data
  } catch (error) {
    console.log(error)
    return handleApiError(error)
  }
}

// export async function checkUserNameExist(username: string) {
//   try {
//     const response = (
//       await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/check-username/${username}`
//       )
//     ).data
//     return response.exist
//   } catch (error) {
//     // console.log(error)
//   }
// }

// Check if the username exists
export async function checkUserNameExist(
  username: string
){
  try {
    const response = await axios.get(`/api/users/check-username/${username}`)
    return response.data
  } catch (error) {
    console.log(error)
    return handleApiError(error)
  }
}

// export async function createUser(user: MainUserObject){
//   // const isUserExisted = await checkUser(user.uid)
//   // if (!isUserExisted) {
//     // console.log(user, "At createUser")
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/create-user`,
//         { user }
//       )
//       console.log(response.data)
//     } catch (error) {
//       console.log(error)
//     }
//   // }
// }

// Create a new user
export async function createUser(user: MainUserObject) {
  // const isUserExisted = await checkUser(user.uid);
  // if (!isUserExisted) {
    try {
      const response = await axios.post("/api/users/create-user", { user });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  // }
}

// export async function fetchUser(uid: string) {
//   try {
//     const user = (
//       await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/fetch-user/${uid}`
//       )
//     ).data.userObject

//     // console.log("Fetched user", user)
//     return user
//   } catch (error) {
//     // console.log("Error fetching user:", error)
//   }
// }

// Fetch user data
export async function fetchUser(uid: string){
  try {
    const response = await axios.get(`/api/users/fetch-user/${uid}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching user:", error);
    return handleApiError(error)
  }
}

// export async function updateUserProfile(
//   uid: string,
//   username: string,
//   name: string
// ) {
//   // console.log("Came to update profile")

//   // Wrap username and name in an updateFields object
//   const updateFields = { updateFields: { username, name } }
//   // console.log("Payload:", updateFields)

//   try {
//     // console.log("Started")
//     const response = await axios.patch(
//       `${process.env.NEXT_PUBLIC_API_URL}/users/update-profile/${uid}`,
//       updateFields
//     )
//     // console.log("Completed")

//     // console.log("response", response.data)

//     return response.data
//   } catch (error) {
//     console.error("Error updating profile:", error)
//   }
// }

// Update user profile
export async function updateUserProfile(uid: string, username: string, name: string) {
  const updateFields = { username, name };

  try {
    const response = await axios.patch(`/api/users/update-profile/${uid}`, updateFields);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}


// export async function updateOnBoardingDataToUser(
//   onBOardingData: onBoardingDataType,
//   uid: string
// ) {
//   try {
//     const response = await axios.patch(
//       `${process.env.NEXT_PUBLIC_API_URL}/users/update-onboardingdata/${uid}`,
//       onBOardingData
//     )
//     // console.log("OnBoarding Response", response.data)
//   } catch (error) {
//     console.error("Error updating onBoardingData:", error)
//   }
// }

// Update onboarding data
export async function updateOnBoardingDataToUser(onBOardingData: onBoardingDataType, uid: string) {
  try {
    const response = await axios.patch(`/api/users/update-onboardingdata/${uid}`, onBOardingData);
    console.log("OnBoarding Response", response.data);
  } catch (error) {
    console.error("Error updating onboarding data:", error);
  }
}


// export const updateLastLogin = async (uid: string) => {
//   // console.log("Last login updating:");
//   try {
//     const response = await axios.patch(
//       `${process.env.NEXT_PUBLIC_API_URL}/users/updateLastLogin/${uid}`
//     )
//     console.log("Last login updated:", response.data)
//   } catch (error) {
//     console.error("Failed to update last login:", error)
//   }
// }

// Update last login
export const updateLastLogin = async (uid: string) => {
  try {
    const response = await axios.patch(`/api/users/updateLastLogin/${uid}`);
    console.log("Last login updated:", response.data);
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
};

// export async function onBoardingStatus(uid: string) {
//   try {
//     const response = (
//       await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/onboarding-status/${uid}`
//       )
//     ).data
//     // console.log(response)
//     return response.flag
//   } catch (error) {
//     console.error("Error on onBoarding status:", error)
//   }
// }

// Get onboarding status

export async function onBoardingStatus(uid: string) {
  try {
    const response = await axios.get(`/api/users/onboarding-status/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error on onboarding status:", error);
  }
}
