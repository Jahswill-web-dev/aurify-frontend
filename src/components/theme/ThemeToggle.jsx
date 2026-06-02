"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-white px-3 text-h6 font-medium text-p-text-darker shadow-card transition-colors hover:border-primary hover:text-primary dark:border-[#343844] dark:bg-[#17191f] dark:text-[#d6dae2] dark:hover:border-primary dark:hover:text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;
