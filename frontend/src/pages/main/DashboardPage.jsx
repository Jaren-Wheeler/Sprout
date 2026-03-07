import React from "react";

import BudgetDashboardCard from "./BudgetDashboardCard";
import DietDashboardCard from "./DietDashboardCard";
import ScheduleDashboardCard from "./ScheduleDashboardCard";
import NotesDashboardCard from "./NotesDashboardCard";

export default function DashboardPage() {

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        <BudgetDashboardCard />

        <DietDashboardCard />

        <ScheduleDashboardCard />

        <NotesDashboardCard />

      </div>

    </div>
  );
}