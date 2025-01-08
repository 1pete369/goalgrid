"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import HabitFeature from "@/features/Habits/HabitFeature"

export default function HabitsPage() {
  return (
    <SidebarProvider>
    <SidebarInset>
      <HabitFeature />
    </SidebarInset>
  </SidebarProvider>
  )
}
