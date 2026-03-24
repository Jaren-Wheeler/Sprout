import React, { useState, useEffect } from "react";

import BudgetDashboardCard from "./BudgetDashboardCard";
import DietDashboardCard from "./DietDashboardCard";
import ScheduleDashboardCard from "./ScheduleDashboardCard";
import NotesDashboardCard from "./NotesDashboardCard";
import ExploreHabitatButton from "./ExploreHabitatButton";
import OnboardingTour from "../../components/OnboardingTour";
import backgroundImage from "../../assets/board.jpg";
import note3 from "../../assets/note1.png";

export default function DashboardPage({ user, setUser }) {

  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    if (!user) return;

    const localKey = `hasSeenOnboarding_${user.uid}`;
    const hasSeenLocal = localStorage.getItem(localKey);

    // ✅ Show ONLY if both say false
    if (!user.hasSeenOnboarding && !hasSeenLocal) {
      setShowTour(true);
    } else {
      setShowTour(false);
    }

  }, [user]);

  const handleTourComplete = () => {
    const localKey = `hasSeenOnboarding_${user.uid}`;
    localStorage.setItem(localKey, "true"); // ✅ FIXED

    setShowTour(false);
  };

  return (
    <div className="sprout-dashboard"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%',    
        backgroundPosition: 'top center', 
        backgroundAttachment: 'scroll'
    }}>

      {showTour && (
        <OnboardingTour user={user} onComplete={handleTourComplete} setUser={setUser} />
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%' 
      }}>
        <div 
          className="dashboard-header-card"
          style={{ 
            backgroundImage: `url(${note3})`,
            backgroundSize: '100% 85%', 
            backgroundRepeat: 'no-repeat',
            padding: '40px 60px',
            display: 'inline-block', 
            minWidth: '180px' 
          }}
        >
          <div className="sprout-dashboard-header">
            <h1 className="sprout-title">Dashboard</h1>
            <p className="sprout-subtitle">
                Overview of your activity
            </p>
          </div>
        </div>
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

      <ExploreHabitatButton className="explore-tour" />

    </div>
  );
}