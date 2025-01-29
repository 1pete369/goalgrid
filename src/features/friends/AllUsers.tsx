"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import FriendRequestButton from "./FriendRequestButton"
import Image from "next/image"
import { useFetchUsersAndFriends } from "@/hooks/useFetchUsersAndFriends"

export default function AllUsers() {
  const { user } = useUserContext()
  const myId = user?.uid

  const { users, friendList, refreshFriendList } = useFetchUsersAndFriends(myId)

  const getFriendStatus = (userId: string) => {
    const friend = friendList.find(
      (friend) =>
        friend.recipientId === userId || friend.requesterId === userId
    )
    return friend ? friend.status : null
  }

  return (
    <div className="flex gap-2 flex-wrap text-black">
      {Array.isArray(users) && users.length>0 && users.filter((user) => user.uid !== myId)
        .map((user) => (
          <div
            className="flex flex-col p-4 shadow-md w-[240px] gap-4 border-2 rounded-sm"
            key={user.uid}
          >
            <div className="flex items-center gap-4">
              <Image
                src={user.personalInfo.photoURL}
                height={40}
                width={40}
                className="rounded-full w-10 h-10 border-black border-2"
                alt="profile"
              />
              <div className="flex-col gap-2 text-sm">
                <h3>{user.personalInfo.name}</h3>
                <p>@{user.personalInfo.username}</p>
              </div>
            </div>
            <FriendRequestButton
              recipientUserId={user.uid}
              myUserId={myId as string}
              friendStatus={getFriendStatus(user.uid)}
              refreshFriendList={refreshFriendList}
            />
          </div>
        ))}
    </div>
  )
}
