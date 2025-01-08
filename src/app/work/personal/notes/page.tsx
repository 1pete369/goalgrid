"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import NotesFeature from "@/features/Notes/NotesFeature"

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <NotesFeature />
      </SidebarInset>
    </SidebarProvider>
  )
}
