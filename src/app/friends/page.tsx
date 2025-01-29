"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserContext } from "@/contexts/UserDataProviderContext"

import AllUsers from "@/features/friends/AllUsers"
import FriendRequests from "@/features/friends/FriendRequests"
import FriendsList from "@/features/friends/FriendsList"

export default function Page() {

  const {user, loading} = useUserContext()

  if(loading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="">Loading...</p>
      </div>
    )


  return (
    <div className="p-4 min-h-[calc(100vh-75px)] w-full text-lg">
      <Tabs defaultValue="all-users" className="max-w-4xl mx-auto">
        <TabsList className="w-full">
          <TabsTrigger value="all-users" className="w-full text-base">
            all-users
          </TabsTrigger>
          <TabsTrigger value="friends-list" className="w-full text-base">
            friends-list
          </TabsTrigger>
          <TabsTrigger value="friend-requests" className="w-full text-base">
            friend-requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-users" className="w-full overflow-y-scroll">
          <AllUsers />
        </TabsContent>
        <TabsContent value="friends-list" className="w-full">
          <FriendsList />
        </TabsContent>
        <TabsContent value="friend-requests" className="w-full">
          <FriendRequests />
        </TabsContent>
      </Tabs>
    </div>
  )
}
