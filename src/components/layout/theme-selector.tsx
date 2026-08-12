"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Palette, Moon, Sun, Sparkles, Monitor, CircleDashed } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const colorThemes = [
  { id: "blue", name: "Sabah Blue", color: "bg-blue-500" },
  { id: "emerald", name: "Emerald", color: "bg-emerald-500" },
  { id: "amber", name: "Amber", color: "bg-amber-500" },
  { id: "rose", name: "Rose", color: "bg-rose-500" },
  { id: "violet", name: "Violet", color: "bg-violet-500" },
] as const;

const bgThemes = [
  { id: "light", name: "Light Mode", icon: Sun },
  { id: "dark", name: "Dark Mode", icon: Moon },
  { id: "grey", name: "Slate Grey", icon: Monitor },
  { id: "neon", name: "Neon Matrix", icon: Sparkles },
  { id: "bright", name: "Bright White", icon: CircleDashed },
] as const;

export function ThemeSelector() {
  const { themeColor, setThemeColor, bgTheme, setBgTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        title="Tukar Tema"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl z-50 w-56 animate-in fade-in slide-in-from-top-2">
          
          <h4 className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Latar Belakang</h4>
          <div className="flex flex-col gap-1 mb-4">
            {bgThemes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setBgTheme(t.id as any);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${bgTheme === t.id ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                >
                  <Icon className="h-4 w-4" />
                  {t.name}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700 mb-3 mx-2" />

          <h4 className="text-[10px] font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Warna Aksen</h4>
          <div className="flex flex-col gap-1">
            {colorThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setThemeColor(t.id as any);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${themeColor === t.id ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              >
                <span className={`w-4 h-4 rounded-full shadow-sm ${t.color}`} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
