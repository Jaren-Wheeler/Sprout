// frontend/src/state/theme.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "sprout_theme";

function normalizeTheme(value) {
  return value === "dark" ? "dark" : "light";
}

function applyThemeToDom(theme) {
  // Body classes are super compatible with existing CSS patterns
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);

  // Optional: also set an attribute for CSS hooks if you want later
  document.documentElement.setAttribute("data-theme", theme);
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return normalizeTheme(localStorage.getItem(THEME_KEY));
    } catch {
      return "light";
    }
  });

  const setTheme = (next) => {
    const t = normalizeTheme(next);
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      // ignore
    }
    applyThemeToDom(t);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Apply on first load
    applyThemeToDom(theme);
  }, []); // run once

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider />");
  return ctx;
}