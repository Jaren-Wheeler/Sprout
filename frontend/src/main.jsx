// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { ThemeProvider } from "./state/theme.jsx";

import "./styles/base/reset.css";
import "./styles/base/theme.css";
import "./styles/base/animations.css";

import "./styles/layout/home.css";
import "./styles/layout/auth.css";
import "./styles/layout/dashboard.css";

import "./styles/components/buttons.css";
import "./styles/components/forms.css";
import "./styles/components/toggles.css";

/**
 * ✅ IMPORTANT:
 * Backend uses session cookies (credentials).
 * Requests must include cookies or they may fail.
 *
 * NOTE:
 * We do NOT configure axios here.
 * Cookies are handled centrally in src/lib/api.js via `withCredentials: true`.
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);