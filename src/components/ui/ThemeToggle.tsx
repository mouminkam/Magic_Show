"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/** Icon-only theme toggle. Renders a stable placeholder until mounted to avoid SSR/CSR mismatch. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`text-muted hover:text-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 rounded ${className}`}
    >
      {mounted && theme === "dark" ? (
        <Sun className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
      )}
    </button>
  );
}
