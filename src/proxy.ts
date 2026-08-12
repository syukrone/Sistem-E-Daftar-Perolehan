import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  // Matches all routes except static assets and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
