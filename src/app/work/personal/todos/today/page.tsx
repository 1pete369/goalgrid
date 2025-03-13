"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import HabitTracker from "@/features/Todo/TodayTodoList"
import TodoFeature from "@/features/TodoList/TodoCategoryFeature"

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <HabitTracker />
      </SidebarInset>
    </SidebarProvider>
  )
}
