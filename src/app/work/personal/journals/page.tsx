"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import JournalFeature from "@/features/Journal/JournalFeature"

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <JournalFeature />
      </SidebarInset>
    </SidebarProvider>
  )
}
