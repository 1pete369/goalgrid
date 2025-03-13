"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import RewardsFeature from "@/features/rewards/RewardFeature"

export default function RewardsPage() {
  return (
    <SidebarProvider>
    <SidebarInset>
      <RewardsFeature />
    </SidebarInset>
  </SidebarProvider>
  )
}
