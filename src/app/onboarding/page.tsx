import { OnBoarding } from "@/features/onboarding/OnBoarding"
import { Suspense } from "react"

export default function page() {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
      <OnBoarding />
    // </Suspense>
  )
}
