// frontend/src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../state/theme.jsx";

import bgLight from "../assets/bg-light.png";
import bgDark from "../assets/bg-dark.png";

export default function Layout() {
  const { theme } = useTheme();

  useEffect(() => {
    // Tag body so home/auth styling doesn't "bleed" into app pages
    document.body.classList.add("sprout-app");
    document.body.classList.remove("sprout-home");

    return () => document.body.classList.remove("sprout-app");
  }, []);

  useEffect(() => {
    // Ensure app pages follow the same theme the user picked
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    // Global background for ALL app pages
    const bg = theme === "dark" ? bgDark : bgLight;
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <main style={{ padding: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}