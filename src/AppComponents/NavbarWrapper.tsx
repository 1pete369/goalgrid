"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
// import NavbarLinks from "./NavbarLinks"; // A new component to handle navbar links
import ProfilePopOver from "./ProfilePopOver";
import Link from "next/link";

export default function NavbarWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession(); // Retrieve session data from next-auth
  const user = session?.user; // Get the user object from the session
  const pathname = usePathname();

  const canNavbarSet = pathname.split("/")[1] === "work";

  if (canNavbarSet) {
    return null; // Ensures nothing is rendered if the route is "/work"
  }

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md text-neutral-800">
      <div className="container mx-auto p-4 md:px-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            height={30}
            width={30}
            alt="Logo"
            className="object-contain"
          />
          <span className="text-xl font-bold">Your Productivity Hub</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Image
            src="/menu.svg"
            height={24}
            width={24}
            alt="Menu"
          />
        </button>

        {/* Navbar Links */}
        <NavbarLinks isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} />
      </div>
    </div>
  );
}

// Navbar Links Component
type NavbarLinksProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
};

const NavbarLinks = ({ isMenuOpen, setIsMenuOpen, user }: NavbarLinksProps) => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname.split("/")[1]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false); // Close the menu on mobile after link click
  };

  return (
    <div className={`flex items-center space-x-6 ${isMenuOpen ? "flex-col absolute top-16 left-0 w-full bg-white shadow-lg p-6" : "hidden md:flex"}`}>
      <Link href="/" className={activeLink === "" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("")}>
        Home
      </Link>
      <Link href="/work" className={activeLink === "work" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("work")}>
        Work
      </Link>
      <Link href="/donate" className={activeLink === "donate" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("donate")}>
        Donate
      </Link>
      <Link href="/feedback" className={activeLink === "feedback" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("feedback")}>
        Feedback
      </Link>
      <Link href="/pricing" className={activeLink === "pricing" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("pricing")}>
        Pricing
      </Link>
      <Link href="/friends" className={activeLink === "friends" ? "text-primary-500 font-semibold" : "hover:text-primary-500"} onClick={() => handleLinkClick("friends")}>
        Friends
      </Link>
      
      {/* Profile or Get Started Button */}
      {!user ? (
        <Link href="/auth/login">
          <button className="bg-primary-500 text-white py-2 px-6 rounded-md">
            Get Started
          </button>
        </Link>
      ) : (
        <ProfilePopOver />
      )}
    </div>
  );
};
