import { useState, useEffect } from "react"
import axios from "axios"
import { MainUserObject } from "@/types/userTypes"
import { Friend } from "@/types/friendsTypes"

export function useFetchUsersAndFriends(myId: string | undefined) {
  const [users, setUsers] = useState<MainUserObject[]>([])
  const [friendList, setFriendList] = useState<Friend[]>([])

  useEffect(() => {
    if (myId) {
      const fetchData = async () => {
        try {
          const [userResponse, friendResponse] = await Promise.all([
            axios.get("/api/users/get-all-users"),
            axios.get(`/api/users/get-friends-list/${myId}`),
          ])
          setUsers(userResponse.data.allUsers)
          setFriendList(friendResponse.data.friends)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
      fetchData()
    }
  }, [myId])

  const refreshFriendList = async () => {
    try {
      const response = await axios.get(`/api/users/get-friends-list/${myId}`)
      setFriendList(response.data.friends)
    } catch (error) {
      console.error("Error refreshing friend list:", error)
    }
  }

  return { users, friendList, refreshFriendList }
}
