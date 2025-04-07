"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import React from "react"
import Link from "next/link"

export default function SidebarBreadcrumbNavigation() {
  const pathname = usePathname()

  // Function to check if a segment is a UUID
  const isUUID = (segment: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

  // Get path segments from the URL and remove any UUIDs
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && !isUUID(segment)) // Exclude UUIDs

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === pathSegments.length - 1 ? (
                <BreadcrumbPage>
                  {segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()}
                </BreadcrumbPage>
              ) : (
                <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()}
                </Link>
              )}
            </BreadcrumbItem>
            {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
