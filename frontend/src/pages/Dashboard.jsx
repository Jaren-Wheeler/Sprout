import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout/dashboard.css";

// Assets 
import forest from "../assets/forest.png";
import settings from "../assets/settings.png";
import scheduler from "../assets/scheduler.png";
import expenses from "../assets/expenses.png";
import notes from "../assets/notes.png";
import fitness from "../assets/fitness.png";
import askmeanything from "../assets/askmeanything.png";

export default function Dashboard() {
  const navigate = useNavigate();

  const items = [
    { src: settings, route: "/settings" },
    { src: scheduler, route: "/calendar" },
    { src: expenses, route: "/budgets" },
    { src: notes, route: "/notes" },
    { src: fitness, route: "/fitness" },
    { src: askmeanything, route: "/chatbot" },
  ];

  return (
    <div
      className="dashboard-bg"
      style={{ backgroundImage: `url(${forest})` }}
    >
      <div className="dashboard-grid">
        {items.map((item, i) => (
          <img
            key={i}
            src={item.src}
            alt=""
            className="dashboard-item"
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>

      <footer className="dashboard-footer">
        FOOTER HERE
      </footer>
    </div>
  );
}
