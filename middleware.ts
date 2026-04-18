import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require a logged-in Pro user
const isProRoute = createRouteMatcher(["/api/grade(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Rate-limit free usage by IP (tracked in Supabase, enforced in the route handler)
  // Middleware just passes through; actual limit logic lives in /api/grade

  if (isProRoute(req)) {
    // Allow anonymous — handler decides what free vs Pro sees
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
