import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PLAN_ACCESS: { [route: string]: string[] } = {
  "/work/personal": ["free", "personal", "community", "premium", "diamond"],
  "/work/community": ["community", "premium", "diamond"],
  "/friends": [], // Restricted for everyone
};

function isAccessAllowed(path: string, userPlan: string): boolean {
  if (path.startsWith("/work/personal")) {
    return PLAN_ACCESS["/work/personal"].includes(userPlan);
  }
  if (path.startsWith("/work/community")) {
    return PLAN_ACCESS["/work/community"].includes(userPlan);
  }
  if (path.startsWith("/friends")) {
    return false;
  }
  return true; // Default allow for unprotected routes
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // If user is not authenticated
  if (!token) {
    const loginUrl = new URL(`/auth/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userPlan: string =
    typeof token.subscriptionPlan === "string" ? token.subscriptionPlan : "free";

  // Check plan access
  if (!isAccessAllowed(path, userPlan)) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:path*", "/friends"],
};
