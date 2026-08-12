import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // configured in auth.ts
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "fallback_secret_for_development_only_12345",
} satisfies NextAuthConfig;
