import React from "react"

export default function LoadingState() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  )
}
