import { WorkAppSidebar } from "@/AppComponents/WorkSpaceSideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workspace"
}

export default function WorkSpaceLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider suppressHydrationWarning={true}>
      <WorkAppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  )
}
