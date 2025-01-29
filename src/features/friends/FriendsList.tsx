"use client"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Friend } from "@/types/friendsTypes"
import axios from "axios"
import React, { useEffect, useState } from "react"

export default function FriendsList() {
  const [friendList, setFriendList] = useState<Friend[]>([])
  const [friendListData, setFriendListData] = useState<any[]>([])
  const { user } = useUserContext()

  useEffect(() => {
    if (user !== null && friendList.length === 0) {
      async function fetchFriendsAndData() {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/get-friends-list/${user?.uid}`
          )
          const friends: Friend[] = response.data.friends
          if (friends.length > 0) {
            setFriendList(friends)

            const friendIds: string[] = friends.map((friend: Friend) =>
              friend.requesterId === user?.uid
                ? friend.recipientId
                : friend.requesterId
            )

            const friendsDataResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/users/get-users-by-ids`,
              { userIds: friendIds }
            )

            setFriendListData(friendsDataResponse.data.users)
          }
        } catch (error) {
          console.error(error)
        }
      }

      fetchFriendsAndData()
    }
  }, [user])

  const acceptedFriends = friendList
    .filter((friend) => friend.status === "accepted")
    .map((friend) => {
      const friendId =
        friend.requesterId === user?.uid
          ? friend.recipientId
          : friend.requesterId

      return friendListData.find((userData) => userData.uid === friendId)
    })
    .filter(Boolean)

  return (
    <div className="p-4 flex flex-col gap-4">
      {Array.isArray(acceptedFriends) && acceptedFriends.length > 0 ? (
        acceptedFriends.map((friendData: any, i: number) => (
          <div className="flex items-center gap-4" key={i}>
            <img
              src={friendData.personalInfo.photoURL} // Corrected access to personalInfo
              alt="profile"
              className="rounded-full w-10 h-10 border-black/10 border-2"
            />
            <div className="flex flex-col gap-1 text-sm">
              <h3>{friendData.personalInfo.name}</h3>{" "}
              <p>@{friendData.personalInfo.username}</p>{" "}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No Friends yet!</p>
      )}
    </div>
  )
}
