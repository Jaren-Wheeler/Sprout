import React from "react";

import BudgetDashboardCard from "./BudgetDashboardCard";
import DietDashboardCard from "./DietDashboardCard";
import ScheduleDashboardCard from "./ScheduleDashboardCard";
import NotesDashboardCard from "./NotesDashboardCard";

export default function DashboardPage() {

  return (
    <div className="sprout-dashboard">

      <div className="sprout-dashboard-header">
        <h1 className="sprout-title">Dashboard</h1>
        <p className="sprout-subtitle">
          Overview of your activity
        </p>
      </div>

      <div className="sprout-dashboard-grid">

        <BudgetDashboardCard />
        <DietDashboardCard />
        <ScheduleDashboardCard />
        <NotesDashboardCard />

      </div>

    </div>
  );
}