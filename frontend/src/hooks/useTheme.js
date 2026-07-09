import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "alcrro-theme";
const SWITCH_CLASS = "theme-switching";
const SWITCH_DURATION = 300;

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add(SWITCH_CLASS);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    setTimeout(() => root.classList.remove(SWITCH_CLASS), SWITCH_DURATION);
  }, []);

  return { theme, toggle, isDark: theme === "dark" };
}
