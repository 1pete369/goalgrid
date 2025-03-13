import { Loader2 } from "lucide-react"
import React from "react"

export default function FullPageLoading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-500" />
    </div>
  )
}
