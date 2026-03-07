import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, route, children }) {

  const navigate = useNavigate();

  return (
    <div
      className="dashboard-card"
      onClick={() => navigate(route)}
    >

      <div className="dashboard-card-header">
        <h2>{title}</h2>
        <span className="dashboard-card-link">View →</span>
      </div>

      <div className="dashboard-card-body">
        {children}
      </div>

    </div>
  );
}