import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Access control based on plans
const PLAN_ACCESS: { [route: string]: string[] } = {
  "/work/personal": ["free", "personal", "community", "premium", "diamond"],
  "/work/community": ["community", "premium", "diamond"],
  "/friends": [], // Blocked for all
};

// Function to check access
function isAccessAllowed(path: string, userPlan: string): boolean {
  if (path.startsWith("/work/personal")) {
    return PLAN_ACCESS["/work/personal"].includes(userPlan);
  }
  if (path.startsWith("/work/community")) {
    return PLAN_ACCESS["/work/community"].includes(userPlan);
  }
  if (path.startsWith("/friends")) {
    return false; // Always restricted
  }
  return true; // Allow all other routes
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Debug logs (only in dev)
  if (process.env.NODE_ENV !== "production") {
    console.log("🔐 Token:", token);
    console.log("🌐 Path:", path);
  }

  // Redirect unauthenticated users to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const userPlan = typeof token.subscriptionPlan === "string" ? token.subscriptionPlan : "free";

  try {
    if (!isAccessAllowed(path, userPlan)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:path*", "/friends"],
};
