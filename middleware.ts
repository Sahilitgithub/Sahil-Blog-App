import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, userAgent } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl.pathname;

  // Protect admin routes
  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Track visits (skip bots, skip API/_next)
  const shouldTrack =
    isPublicRoute(req) || (!!userId && !url.startsWith("/api") && !url.startsWith("/_next"));

  if (shouldTrack) {
    const ua = userAgent(req);
    const isBot = ua.ua.toLowerCase().includes("bot");
    if (!isBot) {
      const device = ua.device.type === "mobile" ? "mobile" : "desktop";
      await fetch(`${req.nextUrl.origin}/api/log-visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAgent: ua.ua, device, userId: userId || null }),
      });
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/webhooks/clerk).*)",
  ],
};