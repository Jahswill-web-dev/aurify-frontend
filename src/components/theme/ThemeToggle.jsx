"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

function ThemeToggle({ className = "", showLabel = true }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-grey-25 bg-white px-3 text-h6 font-semibold text-grey-200 shadow-card transition-colors hover:border-primary hover:bg-accent-25 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:shadow-none dark:hover:border-primary-25 dark:hover:bg-dark-surface-soft dark:hover:text-primary-25 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
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
      {showLabel ? <span>{isDark ? "Light" : "Dark"}</span> : null}
    </button>
  );
}

export default ThemeToggle;
