import { SidebarProvider } from "@/components/ui/sidebar" // Wrap in SidebarProvider
import { AppSidebar } from "@/components/app-sidebar" // Your sidebar component
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import SidebarBreadcrumbNavigation from "@/AppComponents/SidebarBreadcrumbNavigation"

export default function WorkLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <header className="fixed flex h-16 shrink-0 items-center px-4 gap-2 w-full  top-0 z-50 bg-gray-100 text-slate-900 dark:bg-black dark:text-white">
            <SidebarTrigger className="-ml-1" /> {/* Sidebar trigger button */}
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SidebarBreadcrumbNavigation /> {/* ✅ Dynamic Breadcrumbs */}
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
