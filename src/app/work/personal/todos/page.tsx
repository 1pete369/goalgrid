"use client"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import TodoFeature from "@/features/TodoList/TodoFeature"

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <TodoFeature />
      </SidebarInset>
    </SidebarProvider>
  )
}
