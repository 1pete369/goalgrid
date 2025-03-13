import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// 🔥 Define allowed plans for different routes
const PLAN_ACCESS: { [key: string]: string[] } = {
  "/work/personal": ["free", "personal", "community", "premium", "diamond"], // Accessible for these plans
  "/work/community": ["community", "premium", "diamond"], // Accessible for these plans
  "/friends": [] // No access for anyone (empty array means restricted)
};

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userId = token.sub; // User ID from session
    const path = req.nextUrl.pathname; // Current route

    const userPlan : string = (typeof token.subscriptionPlan==="string") ? token.subscriptionPlan : "free"; // Default to "free" if subscriptionPlan is not set

    try {
      // ❌ Check if the current route matches the plan requirements
      if (
        (path.startsWith("/work/personal") && !PLAN_ACCESS["/work/personal"].includes(userPlan)) ||
        (path.startsWith("/work/community") && !PLAN_ACCESS["/work/community"].includes(userPlan)) 
        // ||(path.startsWith("/friends")) // Block access to /friends route for everyone
      ) {
        return NextResponse.redirect(new URL("/pricing", req.url)); // Redirect to pricing page if not allowed
      }
    } catch (error) {
      console.error("Error in subscription check:", error);
      return NextResponse.redirect(new URL("/error", req.url)); // Redirect on error
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow only authenticated users
    },
  }
);

export const config = {
  matcher: ["/work/:path*", "/work/personal/:path*", "/work/community/:path*", "/friends"], // 🔒 Protect all /work/personal and /work/community sub-routes
};
