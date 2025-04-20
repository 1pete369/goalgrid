"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items
}: {
  items: {
    title?: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild >
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
              <SidebarMenuSub className="border-none px-0 py-2 ml-1 gap-4">
                {item.items?.map((subItem) => {
                  const isActive = pathname.startsWith(subItem.url)

                  return (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      className={`rounded-sm px-2 py-1.5 flex items-center gap-2 transition-all duration-200 
                      ${
                        isActive
                          ? " shadow-lg scale-[1.02] bg-primary-800"
                          : " border-primary-500 border-2"
                      }
                    `}
                    >
                      <SidebarMenuSubButton
                        asChild
                        className={`flex items-center gap-2 text-black dark:text-white hover:text-black w-full active:bg-transparent hover:bg-transparent
                        ${
                          isActive
                            ? "font-semibold dark:text-white text-white hover:text-white "
                            : ""
                        }
                      `}
                      >
                        <Link href={subItem.url}>
                          {subItem.icon && (
                            <subItem.icon
                              color={
                                isActive
                                  ? theme === "dark"
                                    ? "white"
                                    : "white"
                                  : theme === "dark"
                                  ? "white"
                                  : "black"
                              }
                              size={16}
                            />
                          )}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
