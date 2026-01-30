"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme-mode") as ThemeMode;
    if (saved && (saved === "dark" || saved === "light")) {
      setMode(saved);
    }
    // Default to dark mode if no preference saved (brand preference)
    // Users can switch to light mode via toggle, which saves to localStorage
  }, []);

  // Save preference when changed
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme-mode", mode);
      // Update document for CSS variables if needed
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeContextProvider");
  }
  return context;
}
