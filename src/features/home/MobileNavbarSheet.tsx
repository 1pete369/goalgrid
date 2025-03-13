import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { ArrowRight, Menu } from "lucide-react"
import Link from "next/link"
import { navLinks } from "./NavLinks"
import GetStarted from "./GetStarted"
import ToggleTheme from "./ToggleTheme"

export function MobileNavbarSheet() {
  return (
    <Sheet >
      <SheetTrigger asChild className="lg:hidden">
        <Button className="bg-black text-white hover:bg-black">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center lg:hidden">
        <SheetHeader className=" sr-only">
          <SheetTitle>Mobile Navbar</SheetTitle>
          <SheetDescription>
            Mobile Navbar Links
          </SheetDescription>
        </SheetHeader>
        <ul className=" flex flex-col items-center space-y-5">
          {navLinks.map((navLink, index) => {
            return (
              <li
                key={index}
                className="flex items-center px-6 py-2 rounded-sm hover:bg-neutral-100 hover:text-black"
              >
                <Link href={navLink.link}>{navLink.label}</Link>
              </li>
            )
          })}
        </ul>
        <div className=" flex gap-2">
        <GetStarted />
        <ToggleTheme />
        </div>
      </SheetContent>
    </Sheet>
  )
}
