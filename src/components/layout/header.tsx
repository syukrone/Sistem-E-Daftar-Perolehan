import { User2, Bell } from "lucide-react";
import { ThemeSelector } from "./theme-selector";

export function Header({ user }: { user?: { name?: string | null, role?: string | null, email?: string | null } }) {
  return (
    <header className="relative z-40 flex h-20 shrink-0 items-center gap-x-6 border-b border-white/40 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 px-6 backdrop-blur-xl shadow-sm">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          <ThemeSelector />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-300 dark:lg:bg-slate-700" aria-hidden="true" />

          {/* Profile */}
          <div className="flex items-center gap-x-4">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <User2 className="h-5 w-5" />
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200" aria-hidden="true">
                {user?.name || user?.email || "User"}
              </span>
              <span className="ml-3 rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 uppercase">
                {user?.role || "Staff"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
