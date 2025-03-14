"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import TodayTodoList from "@/features/Todo/TodayTodoList"

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <TodayTodoList />
      </SidebarInset>
    </SidebarProvider>
  )
}
