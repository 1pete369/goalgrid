"use client"

import {
  AudioWaveform,
  BarChart,
  BookOpen,
  BookOpenText,
  Coffee,
  Folder,
  FolderKanban,
  GalleryVerticalEnd,
  Gift,
  Home,
  Lightbulb,
  ListTodo,
  Megaphone,
  MessageCircle,
  NotebookPen,
  Repeat,
  ScrollText,
  Settings2,
  Sparkles,
  StickyNote,
  Target,
  UserCircle,
  Users,
  UsersRound
} from "lucide-react"
import * as React from "react"

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
import { usePathname } from "next/navigation"

const data = {
  workspaces: [
    {
      name: "My Space",
      logo: UserCircle,
      plan: "Free",
      navMain: [
        {
          title: "Personal Dashboard",
          url: "/work",
          icon: Home,
          items: [
            {
              title: "Task Categories",
              url: "/work/personal/todos/categories",
              icon: FolderKanban // for task organization
            },
            {
              title: "Today's Tasks",
              url: "/work/personal/todos/today",
              icon: ListTodo // for daily task list
            },
            {
              title: "Habit Tracker",
              url: "/work/personal/habits",
              icon: Repeat // for tracking recurring habits
            },
            {
              title: "Goal Setting",
              url: "/work/personal/goals",
              icon: Target // represents goal focus
            },
            {
              title: "Notes",
              url: "/work/personal/notes",
              icon: StickyNote // classic notes icon
            },
            {
              title: "Rewards",
              url: "/work/personal/rewards",
              icon: Gift // reward symbol
            },
            {
              title: "Personal Journal",
              url: "/work/personal/journals",
              icon: BookOpen // for writing/journaling
            },
            {
              title: "Insights",
              url: "/work/personal/analytics",
              icon: BarChart // for analytics/insights
            }
          ]
        }
        // {
        //   title: "Settings",
        //   url: "#",
        //   icon : Settings2,
        //   items: [
        //     {
        //       title: "Profile",
        //       url: "#"
        //     },
        //     {
        //       title: "Account Security",
        //       url: "#"
        //     },
        //     {
        //       title: "Preferences",
        //       url: "#"
        //     }
        //   ]
        // },
        // {
        //   title: "Learning Flo, // Learning section
        //   url: "#",
        //   icon : BookOpen,
        //   items: [
        //     {
        //       title: "Resources",
        //       url: "#"
        //     },
        //     {
        //       title: "Learning",
        //       url: "#"
        //     },
        //     {
        //       title: "Code Editors",
        //       url: "#"
        //     },
        //     {
        //       title: "Code Storing",
        //       url: "#"
        //     }
        //   ]
        // }
      ]
    },
    {
      name: "Community Space",
      logo: UsersRound,
      plan: "Free",
      navMain: [
        // {
        //   title: "Community Dashboard",
        //   url: "#",
        //   icon : Users,
        //   items: [
        //     {
        //       title: "Group To-Do List",
        //       url: "#"
        //     },
        //     {
        //       title: "Challenges",
        //       url: "#"
        //     },
        //     {
        //       title: "Events",
        //       url: "#"
        //     },
        //     {
        //       title: "Leaderboards",
        //       url: "#"
        //     },
        //     {
        //       title: "Community Journal",
        //       url: "#"
        //     },
        //     {
        //       title: "Recognition",
        //       url: "#"
        //     }
        //   ]
        // },
        {
          title: "Community Chats",
          url: "#",
          icon: Users, // Represents people/community
          items: [
            {
              title: "Beginner's Chat",
              url: "/work/community/beginners-chat",
              icon: MessageCircle // Support and welcome for newcomers
            },
            {
              title: "Daily Wins",
              url: "/work/community/daily-wins",
              icon: Sparkles // Share progress and motivation
            },
            {
              title: "Public Journals",
              url: "/work/community/public-journals",
              icon: BookOpenText // Shared journal entries
            },
            {
              title: "Community Journal",
              url: "/work/community/community-journal",
              icon: ScrollText // Weekly summary or curated stories by admins/mods
            },
            {
              title: "General Hangout",
              url: "/work/community/general",
              icon: Coffee // Casual, off-topic conversations
            }
          ]
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [activeWorkspace, setActiveWorkspace] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeWorkspace") || "My Space"
    }
    return "My Space"
  })

  const { user } = useUserContext()

  const pathname = usePathname()

React.useEffect(() => {
  if (pathname.startsWith('/work/personal')) {
    setActiveWorkspace("My Space")
    localStorage.setItem("activeWorkspace", "My Space")
  } else if (pathname.startsWith('/work/community')) {
    setActiveWorkspace("Community Space")
    localStorage.setItem("activeWorkspace", "Community Space")
  }
}, [pathname])

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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={data.workspaces}
          setActiveWorkspace={setActiveWorkspace}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.workspaces.navMain} /> */}
        <NavMain
          items={
            activeWorkspace === "My Space"
              ? data.workspaces[0].navMain
              : data.workspaces[1].navMain
          }
        />
        {/* <NavProjects projects={data.workspaces.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {NavUserObject && <NavUser user={NavUserObject} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
