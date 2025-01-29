"use client"

import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Friend } from "@/types/friendsTypes"
import axios from "axios"
import { Ban, Check, Minus, Plus } from "lucide-react"
import React, { useEffect, useState } from "react"

type FriendData = {
  uid: string
  personalInfo: {
    name: string
    username: string
    photoURL: string
  }
}

export default function FriendRequests() {
  const [receivedRequests, setReceivedRequests] = useState<Friend[] | []>([])
  const [sentRequests, setSentRequests] = useState<Friend[] | []>([])
  const [users, setUsers] = useState<FriendData[] | []>([]) // Store the user data
  const [loading, setLoading] = useState(true) // Track loading state
  const { user } = useUserContext()

  useEffect(() => {
    if (user !== null) {
      async function getFriendRequests() {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/friends/get-requests/${user?.uid}`
          )
          const { receivedRequests, sentRequests } = response.data
          setReceivedRequests(receivedRequests)
          setSentRequests(sentRequests)

          const requesterIds = [
            ...sentRequests.map((request: Friend) => request.recipientId),
            ...receivedRequests.map((request: Friend) => request.requesterId)
          ]
          const usersResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users/get-users-by-ids`,
            { userIds: requesterIds }
          )
          setUsers(usersResponse.data.users)

          setLoading(false)
        } catch (error) {
          console.error("Error fetching friend requests", error)
          setLoading(false)
        }
      }
      getFriendRequests()
    }
  }, [user])

  const handleFriendRequestDeletion = async (
    recipientId: string,
    requesterId: string
  ) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/delete-friend-request`,
      {
        data: { recipientId, requesterId }
      }
    )

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/pop-friend-id/${requesterId}`,
      { _id: response.data.deletedRequest._id, recipientId: recipientId }
    )

    setSentRequests((prevRequests) =>
      prevRequests.filter(
        (request) =>
          request.recipientId !== recipientId ||
          request.requesterId !== requesterId
      )
    )
  }

  const handleUpdateFriendRequestStatus = async (
    requesterId: string,
    status: "pending" | "accepted" | "rejected" | "blocked"
  ) => {
    if (user !== null) {
      const recipientId = user.uid
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/update-friend-request-status`,
        { requesterId, recipientId, status }
      )

      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requesterId === requesterId ? { ...request, status } : request
        )
      )
      setSentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requesterId === requesterId ? { ...request, status } : request
        )
      )
    }
  }

  if (loading) return <p>Loading...</p>
  if (user === null) return <p>Loading...</p>

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center flex-wrap text-black mt-4">
        {/* Display Received Requests */}
        <div className="flex flex-col">
          <h2>Received Requests</h2>
          {Array.isArray(receivedRequests) && receivedRequests.length > 0 ? (
            receivedRequests.map((friendRequest) => {
              const userData = users.find(
                (u) => u.uid === friendRequest.requesterId
              )

              return (
                <div
                  className="flex flex-col p-2 w-[280px] shadow-md gap-4 border-2 rounded-sm"
                  key={friendRequest.id}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={userData?.personalInfo.photoURL}
                      alt="profile"
                      className="rounded-full w-10 h-10"
                      onError={(e) => (e.currentTarget.src = "/user.png")}
                    />
                    <div>
                      <h3 className="font-semibold">
                        {userData?.personalInfo?.name}
                      </h3>
                      <p className="text-gray-600">
                        @{userData?.personalInfo?.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center justify-between">
                    {friendRequest.status === "pending" && (
                      <p className="text-yellow-500 font-semibold">Pending</p>
                    )}
                    {friendRequest.status === "accepted" && (
                      <p className="text-green-600 font-semibold">Accepted</p>
                    )}
                    {friendRequest.status === "rejected" && (
                      <p className="text-red-500 font-semibold">Rejected</p>
                    )}
                    {friendRequest.status === "blocked" && (
                      <p className="text-gray-500 font-semibold">Blocked</p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-500 shadow-md"
                        onClick={() =>
                          handleUpdateFriendRequestStatus(
                            friendRequest.requesterId,
                            "accepted"
                          )
                        }
                      >
                        <Check />
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-400 shadow-md"
                        onClick={() =>
                          handleUpdateFriendRequestStatus(
                            friendRequest.requesterId,
                            "rejected"
                          )
                        }
                      >
                        <Plus className="rotate-45" />
                      </Button>
                      <Button
                        className="bg-gray-500 hover:bg-gray-400 shadow-md"
                        onClick={() =>
                          handleUpdateFriendRequestStatus(
                            friendRequest.requesterId,
                            "blocked"
                          )
                        }
                      >
                        <Ban />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-600">No received requests found.</p>
          )}
        </div>
        <div className="flex flex-col">
          <h2>Sent Requests</h2>

          {/* Display Sent Requests */}
          {Array.isArray(sentRequests) && sentRequests.length > 0 ? (
            sentRequests.map((friendRequest) => {
              const userData = users.find(
                (u) => u.uid === friendRequest.recipientId
              )
              return (
                <div
                  className="flex flex-col p-2 w-[280px] shadow-md gap-4 border-2 rounded-sm"
                  key={friendRequest.id}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={userData?.personalInfo.photoURL}
                      alt="profile"
                      className="rounded-full w-10 h-10"
                      onError={(e) => (e.currentTarget.src = "/user.png")}
                    />
                    <div>
                      <h3 className="font-semibold">
                        {userData?.personalInfo?.name}
                      </h3>
                      <p className="text-gray-600">
                        @{userData?.personalInfo?.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center justify-between">
                    {friendRequest.status === "pending" && (
                      <p className="text-yellow-500 font-semibold">Pending</p>
                    )}
                    {friendRequest.status === "accepted" && (
                      <p className="text-green-600 font-semibold">Accepted</p>
                    )}
                    {friendRequest.status === "rejected" && (
                      <p className="text-red-500 font-semibold">Rejected</p>
                    )}
                    {friendRequest.status === "blocked" && (
                      <p className="text-gray-500 font-semibold">Blocked</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-500 shadow-md"
                        onClick={() =>
                          handleFriendRequestDeletion(
                            friendRequest.recipientId,
                            friendRequest.requesterId
                          )
                        }
                      >
                        <Minus />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-600">No sent requests found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
