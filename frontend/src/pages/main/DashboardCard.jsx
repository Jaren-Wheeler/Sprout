import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, route, children }) {

  const navigate = useNavigate();

  return (
    <div
      className="sprout-dashboard-card"
      onClick={() => navigate(route)}
    >

      <div className="sprout-dashboard-card-header">

        <h2 className="sprout-dashboard-card-title">
          {title}
        </h2>

        <span className="sprout-dashboard-card-link">
          View →
        </span>

      </div>

      <div className="sprout-dashboard-card-content">
        {children}
      </div>

    </div>
  );
}