import React, { useEffect, useState } from "react";

import BudgetDashboardCard from "./BudgetDashboardCard";
import DietDashboardCard from "./DietDashboardCard";
import ScheduleDashboardCard from "./ScheduleDashboardCard";
import NotesDashboardCard from "./NotesDashboardCard";
import OnboardingTour from "../../components/OnboardingTour";
import AppLayout from "../../components/AppLayout";
import backgroundImage from "../../assets/board.jpg";
import { useTheme } from "../../theme/ThemeContext";

export default function DashboardPage({ user, setUser }) {
  const { theme } = useTheme();
  const [showTour, setShowTour] = useState(false);
  const pageBackground =
    theme === "dark"
      ? "radial-gradient(circle at 18% 14%, rgba(212, 178, 116, 0.11), transparent 20%), radial-gradient(circle at 82% 78%, rgba(145, 114, 72, 0.1), transparent 18%), repeating-linear-gradient(-18deg, rgba(255,248,228,0.02) 0 2px, rgba(255,248,228,0) 2px 13px), linear-gradient(180deg, #181410 0%, #241c15 52%, #31251b 100%)"
      : `radial-gradient(circle at 50% 28%, rgba(255,239,165,0.24), transparent 22%), linear-gradient(180deg, rgba(62,39,20,0.16), rgba(62,39,20,0.08)), url(${backgroundImage})`;

  useEffect(() => {
    if (!user) return;

    const localKey = `hasSeenOnboarding_${user.uid}`;
    const hasSeenLocal = localStorage.getItem(localKey);

    if (!user.hasSeenOnboarding && !hasSeenLocal) {
      setShowTour(true);
    } else {
      setShowTour(false);
    }
  }, [user]);

  const handleTourComplete = () => {
    const localKey = `hasSeenOnboarding_${user.uid}`;
    localStorage.setItem(localKey, "true");
    setShowTour(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-top"
      style={{
        backgroundImage: pageBackground,
        backgroundRepeat: theme === "dark" ? "no-repeat, no-repeat, repeat, no-repeat" : "no-repeat",
        backgroundSize: theme === "dark" ? "auto, auto, 220px 220px, cover" : "cover",
        backgroundPosition: "center top",
      }}
    >
      {showTour && (
        <OnboardingTour user={user} onComplete={handleTourComplete} setUser={setUser} />
      )}

      <AppLayout
        title="Dashboard"
        plainShell
        shellClassName="min-h-screen"
        headerButtonClassName="ml-5 border-[rgba(255,255,255,0.4)] bg-[rgba(255,250,244,0.82)] shadow-[0_20px_34px_rgba(62,39,20,0.18)] dark:border-white/12 dark:bg-[rgba(26,31,41,0.86)] dark:shadow-[0_20px_34px_rgba(0,0,0,0.34)]"
        contentClassName="px-4 py-8 md:px-6 md:py-10"
      >
          <div className="mx-auto w-full max-w-5xl space-y-8">
            <header className="px-1 text-center">
              <h1 className="text-[3.15rem] font-semibold tracking-[-0.03em] text-[#4f2d16] dark:text-[#f2e6c8] md:text-[4rem]">
                Dashboard
              </h1>
            </header>

            <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
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
            </section>
          </div>
        </AppLayout>
    </div>
  );
}
