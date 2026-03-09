import React from "react";

import BudgetDashboardCard from "./BudgetDashboardCard";
import DietDashboardCard from "./DietDashboardCard";
import ScheduleDashboardCard from "./ScheduleDashboardCard";
import NotesDashboardCard from "./NotesDashboardCard";
import ExploreHabitatButton from "./ExploreHabitatButton";
import OnboardingTour from "../../components/OnboardingTour";

export default function DashboardPage() {

  return (
    <div className="sprout-dashboard">

      <OnboardingTour />

      <div className="sprout-dashboard-header">
        <h1 className="sprout-title">Dashboard</h1>
        <p className="sprout-subtitle">
          Overview of your activity
        </p>
      </div>

      <div className="sprout-dashboard-grid">

        <div className="budget-tour">
          <BudgetDashboardCard />
        </div>

        <div className="diet-tour">
          <DietDashboardCard />
        </div>

        <div className="schedule-tour">
          <ScheduleDashboardCard />
        </div>

        <div className="notes-tour">
          <NotesDashboardCard />
        </div>

      </div>

      <div className="explore-tour">
        <ExploreHabitatButton />
      </div>

    </div>
  );
}