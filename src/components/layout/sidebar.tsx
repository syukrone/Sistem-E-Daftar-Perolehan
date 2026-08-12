"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  PlusSquare,
  Settings,
  Users,
  LogOut,
  BarChart3,
  Library
} from "lucide-react";
import { signOut } from "next-auth/react";

const getNavigation = (role?: string) => {
  const common = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Arkib", href: "/dashboard/arkib", icon: Library },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (role === "staff") {
    return [
      ...common,
      { name: "New Document", href: "/dashboard/documents/new", icon: PlusSquare },
    ];
  }

  if (role === "admin") {
    return [
      ...common,
      { name: "New Document", href: "/dashboard/documents/new", icon: PlusSquare },
      { name: "Users", href: "/dashboard/users", icon: Users },
    ];
  }

  // Allow PPKP and PPTK to also create new documents if needed
  if (role === "ppkp" || role === "pptk") {
    return [
      ...common,
      { name: "New Document", href: "/dashboard/documents/new", icon: PlusSquare },
    ];
  }

  return common;
};

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const navigation = getNavigation(role);

  return (
    <div className="flex h-full w-64 flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-white/60 dark:border-slate-700/50 min-h-0">
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-white/40 dark:border-slate-700/50">
        <div className="p-1.5 bg-white rounded-xl shadow-lg shadow-slate-300/30 dark:shadow-black/40 ring-1 ring-slate-100 dark:ring-slate-700 mr-3 flex-shrink-0 transition-transform hover:scale-105">
          <Image src="/jpan-logo-color.png" alt="JPAN Logo" width={52} height={52} className="object-contain drop-shadow-sm" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight leading-none">
            E-Daftar
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
            Perolehan
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-blue-600/10 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-800/30"
                    : "text-slate-600 hover:bg-slate-50/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"}
                `}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 transition-colors ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/40 dark:border-slate-700/50">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-red-50/50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-600" aria-hidden="true" />
          Log Out
        </button>
      </div>
    </div>
  );
}
