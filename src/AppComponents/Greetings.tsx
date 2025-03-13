import { useUserContext } from "@/contexts/UserDataProviderContext"
import React from "react"

type GreetingsPropsType = { feature?: string; type?: string }
export default function Greetings({ feature, type }: GreetingsPropsType) {
  const { user } = useUserContext()
  return (
    <div className="">
      <h1 className="text-xl font-semibold">
        Hello, {user?.personalInfo.name.split(" ")[0]}!
      </h1>

      {feature && (
        <p className="text-sm text-neutral-500">Create {feature} here!</p>
      )}
      {type && (
        <p className="text-sm text-neutral-500">Claim {type} here!</p>
      )}
    </div>
  )
}
