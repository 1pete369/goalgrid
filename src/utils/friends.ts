import { Friend } from "@/types/friendsTypes"
import axios from "axios"

// export async function sendFriendRequest(
//   friendRequestObject: Friend,
//   userId: string
// ) {
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/friends/send-friend-request`,
//       friendRequestObject
//     )
//     console.log(response.data.friendRequest._id)

//     await axios.patch(
//       `${process.env.NEXT_PUBLIC_API_URL}/users/push-friend-id/${userId}`,
//       {
//         _id: response.data.friendRequest._id,
//         recipientId: friendRequestObject.recipientId
//       }
//     )
//     return response.data 
//   } catch (error) {
//     console.error("Failed to send friend request:", error)
//     throw error 
//   }
// }


export async function sendFriendRequest(friendRequestObject: Friend, userId: string) {
  try {
    const response = await axios.post("/api/friends/send-friend-request", {
      friendRequestObject,
      userId
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send friend request:", error);
    throw error;
  }
}
