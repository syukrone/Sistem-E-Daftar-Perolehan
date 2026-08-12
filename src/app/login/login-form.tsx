"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import Image from "next/image";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="relative z-10 w-full max-w-md mx-auto p-8 rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="flex justify-center mb-6">
        <Image src="/jpan-logo-color.png" alt="JPAN Logo" width={80} height={80} className="object-contain drop-shadow-md" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">JPAN Login</h2>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-8 text-sm">Sign in to the Document Tracking System</p>

      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="staff@jpan.sabah.gov.my"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-100/80 border border-red-200 text-red-600 text-sm text-center font-medium">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
