import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Define allowed plans for each route prefix.
const PLAN_ACCESS: { [route: string]: string[] } = {
  "/work/personal": ["free", "personal", "community", "premium", "diamond"],
  "/work/community": ["community", "premium", "diamond"],
  "/friends": [] // Restricted for everyone.
};

// Helper function to check if the user's plan allows access to a given path.
function isAccessAllowed(path: string, userPlan: string): boolean {
  if (path.startsWith("/work/personal")) {
    return PLAN_ACCESS["/work/personal"].includes(userPlan);
  }
  if (path.startsWith("/work/community")) {
    return PLAN_ACCESS["/work/community"].includes(userPlan);
  }
  if (path.startsWith("/friends")) {
    return true; // Always restricted.
  }
  // Default to allow access for routes not explicitly protected.
  return true;
}

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;
    
    // If there's no token (i.e., user not authenticated), redirect to login.
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Extract the user's subscription plan (default to "free" if not set).
    const userPlan: string =
      typeof token.subscriptionPlan === "string" ? token.subscriptionPlan : "free";
    const path = req.nextUrl.pathname;

    try {
      // Check if the user is allowed access based on their subscription plan.
      if (!isAccessAllowed(path, userPlan)) {
        // Redirect unauthorized users to the pricing page.
        return NextResponse.redirect(new URL("/pricing", req.url));
      }
    } catch (error) {
      console.error("Error in subscription check:", error);
      // Optionally redirect to a dedicated error page.
      return NextResponse.redirect(new URL("/error", req.url));
    }

    // Allow the request to proceed if all checks pass.
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow requests from authenticated users.
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify the routes (matcher) that should be protected by this middleware.
export const config = {
  matcher: ["/work/:path*", "/friends"],
};
