// frontend/src/theme/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// These files already exist (your build output shows bg-light and bg-dark).
import bgLight from "../assets/bg-light.png";
import bgDark from "../assets/bg-dark.png";

const ThemeContext = createContext(null);

const STORAGE_KEY = "sprout_theme";
const VALID = new Set(["light", "dark"]);

function applyThemeToBody(theme) {
  // 1) body classes (so your existing CSS like `.home.light` still works)
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);

  // 2) consistent app-wide background for all non-home pages
  // (Home/Auth pages still use `.home` background styles, but this guarantees
  // the rest of the app matches the chosen theme.)
  const bg = theme === "dark" ? bgDark : bgLight;
  document.body.style.backgroundImage = `url(${bg})`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return VALID.has(raw) ? raw : "light";
    } catch {
      return "light";
    }
  });

  const setTheme = (next) => {
    const value = typeof next === "function" ? next(theme) : next;
    const safe = VALID.has(value) ? value : "light";

    setThemeState(safe);
    try {
      localStorage.setItem(STORAGE_KEY, safe);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    applyThemeToBody(theme);
  }, [theme]);

  const api = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider />");
  return ctx;
}