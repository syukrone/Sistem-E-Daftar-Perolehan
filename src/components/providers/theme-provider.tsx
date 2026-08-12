"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeColor = "blue" | "emerald" | "rose" | "amber" | "violet";
export type BgTheme = "light" | "dark" | "grey" | "neon" | "bright";

type ThemeContextType = {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  bgTheme: BgTheme;
  setBgTheme: (theme: BgTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>("blue");
  const [bgTheme, setBgThemeState] = useState<BgTheme>("light");

  useEffect(() => {
    const savedColor = localStorage.getItem("app-theme-color") as ThemeColor;
    if (savedColor) {
      setThemeColor(savedColor);
      document.documentElement.setAttribute("data-theme", savedColor);
    } else {
      document.documentElement.setAttribute("data-theme", "blue");
    }

    const savedBg = localStorage.getItem("app-bg-theme") as BgTheme;
    if (savedBg) {
      applyBgTheme(savedBg);
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyBgTheme(isDark ? "dark" : "light");
    }
  }, []);

  const changeThemeColor = (color: ThemeColor) => {
    setThemeColor(color);
    localStorage.setItem("app-theme-color", color);
    document.documentElement.setAttribute("data-theme", color);
  };

  const applyBgTheme = (theme: BgTheme) => {
    setBgThemeState(theme);
    localStorage.setItem("app-bg-theme", theme);
    document.documentElement.setAttribute("data-bg-theme", theme);
    
    if (["dark", "grey", "neon"].includes(theme)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor: changeThemeColor, bgTheme, setBgTheme: applyBgTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
