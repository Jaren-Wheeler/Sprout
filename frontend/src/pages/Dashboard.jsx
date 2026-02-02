// frontend/src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout/dashboard.css";

// Assets
import forest from "../assets/forest.png";
import settings from "../assets/settings.png"; // (you said leaves = Dashboard; using this as your "Dashboard icon" for now)
import scheduler from "../assets/scheduler.png";
import expenses from "../assets/expenses.png";
import notes from "../assets/notes.png";
import fitness from "../assets/fitness.png";
import askmeanything from "../assets/askmeanything.png";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ Map each image to a route (and label for accessibility)
  const items = [
    { src: settings, label: "Dashboard", route: "/dashboard" }, // Brown Leaves (Dashboard) - stays on dashboard
    { src: scheduler, label: "Calendar", route: "/calendar" },  // Tent
    { src: expenses, label: "Budgeting", route: "/budgets" },   // Fire
    { src: notes, label: "Notes", route: "/notes" },            // Bench
    { src: fitness, label: "Fitness & Diet", route: "/fitness" }, // Butterfly
    { src: askmeanything, label: "AI Chatbot", route: "/chatbot" }, // Salamander
  ];

  const go = (route) => navigate(route);

  return (
    <div className="dashboard-bg" style={{ backgroundImage: `url(${forest})` }}>
      <div className="dashboard-grid">
        {items.map((item, i) => (
          <img
            key={i}
            src={item.src}
            alt={item.label}
            className="dashboard-item"
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onClick={() => go(item.route)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go(item.route);
              }
            }}
          />
        ))}
      </div>

      <footer className="dashboard-footer">FOOTER HERE</footer>
    </div>
  );
}