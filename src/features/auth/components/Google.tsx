"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function GoogleLogin() {
  const router = useRouter(); // Next.js router for navigation

  const handleLogin = async () => {
    try {
      // Perform Google sign-in
      const result = await signIn("google", { redirect: false });

      // Check if the sign-in was successful
      if (result?.error) {
        console.error("Google sign-in failed:", result.error);
      } else {
        // Get the callback URL from query params
        const callbackUrl =
          new URL(window.location.href).searchParams.get("callbackUrl") || "/";

        // Redirect to the callback URL or homepage if not provided
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 border-primary-800 border-2 rounded-full focus:ring-2 focus:ring-black focus:outline-none transition-all min-w-[240px]"
      onClick={handleLogin}
    >
      <Image src={"/google.png"} height={20} width={20} alt="Google" />
      Continue with Google
    </button>
  );
}
