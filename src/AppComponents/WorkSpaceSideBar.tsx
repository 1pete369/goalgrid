"use client"

import {
  AudioWaveform,
  BookOpen,
  Folder,
  GalleryVerticalEnd,
  Home,
  Settings2,
  Users
} from "lucide-react"
import React, { useState } from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { useUserContext } from "@/contexts/UserDataProviderContext"

// This is sample data.
const data = {
  workspaces: [
    {
      name: "My Space",
      logo: GalleryVerticalEnd,
      plan: "Free",
      navMain: [
        {
          title: "Personal Dashboard",
          url: "/work",
          icon: Home,
          items: [
            {
              title: "To-Do List",
              url: "/work/personal/todos"
            },
            {
              title: "Habit Tracker",
              url: "/work/personal/habits"
            },
            {
              title: "Goal Setting",
              url: "/work/personal/goals"
            },
            {
              title: "Notes",
              url: "/work/personal/notes"
            },
            {
              title: "Rewards",
              url: "/work/personal/rewards"
            },
            {
              title: "Timer",
              url: "/work/personal/timer"
            },
            {
              title: "Personal Journal",
              url: "/work/personal/journals"
            },
            {
              title: "Insights",
              url: "/work/personal/analytics"
            }
          ]
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "Profile",
              url: "#"
            },
            {
              title: "Account Security",
              url: "#"
            },
            {
              title: "Preferences",
              url: "#"
            }
          ]
        },
        {
          title: "Learning Flow", // Learning section
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Resources",
              url: "#"
            },
            {
              title: "Learning",
              url: "#"
            },
            {
              title: "Code Editors",
              url: "#"
            },
            {
              title: "Code Storing",
              url: "#"
            }
          ]
        }
      ]
    },
    {
      name: "Community Space",
      logo: AudioWaveform,
      plan: "Free",
      navMain: [
        {
          title: "Community Dashboard",
          url: "#",
          icon: Users,
          items: [
            {
              title: "Group To-Do List",
              url: "#"
            },
            {
              title: "Challenges",
              url: "#"
            },
            {
              title: "Events",
              url: "#"
            },
            {
              title: "Leaderboards",
              url: "#"
            },
            {
              title: "Community Journal",
              url: "#"
            },
            {
              title: "Recognition",
              url: "#"
            }
          ]
        },
        {
          title: "Community chats",
          url: "#",
          icon: Folder,
          items: [
            {
              title: "Beginner's Chat",
              url: "/work/community/beginners-chat"
            },
            {
              title: "Daily wins",
              url: "/work/community/daily-wins"
            },
            {
              title: "Public journals",
              url: "/work/community/public-journals"
            },
            {
              title: "Community Feedback",
              url: "/work/community/community-feedback"
            },
            {
              title: "Community Help",
              url: "#"
            },
            {
              title: "Feedback & Suggestions",
              url: "#"
            },
            {
              title: "Posts & Announcements",
              url: "#"
            },
            {
              title: "Community Wins",
              url: "#"
            },
            {
              title: "Community Journal",
              url: "#"
            }
          ]
        }
      ]
    }
  ]
}

export function WorkAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeWorkspace, setActiveWorkspace] = useState("My Space")
  const { user } = useUserContext()

  // Define the NavUserObjectType to store specific user info
  type NavUserObjectType = {
    name: string
    email: string
    avatar: string
  }

  // Initialize NavUserObject based on the user context
  let NavUserObject: NavUserObjectType | null = null
  if (user !== null) {
    NavUserObject = {
      name: user.personalInfo.name,
      email: user.personalInfo.email,
      avatar: user.personalInfo.photoURL
    }
  }

  return (
    <Sidebar collapsible="icon" {...props} className="z-50">
      <SidebarHeader>
        <TeamSwitcher
          teams={data.workspaces}
          setActiveWorkspace={setActiveWorkspace}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            activeWorkspace === "My Space"
              ? data.workspaces[0].navMain
              : data.workspaces[1].navMain
          }
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {NavUserObject && <NavUser user={NavUserObject} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
