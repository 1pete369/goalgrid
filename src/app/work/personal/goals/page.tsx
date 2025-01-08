"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import GoalFeature from "@/features/Goals/GoalFeature"

export default function HabitsPage() {
  return (
    <SidebarProvider>
    <SidebarInset>
    <GoalFeature />
    </SidebarInset>
  </SidebarProvider>
  )
}
