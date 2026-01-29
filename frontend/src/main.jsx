import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/base/reset.css";
import "./styles/base/theme.css";
import "./styles/base/animations.css";

import "./styles/layout/home.css";
import "./styles/layout/auth.css";
import "./styles/layout/dashboard.css";

import "./styles/components/buttons.css";
import "./styles/components/forms.css";
import "./styles/components/toggles.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
