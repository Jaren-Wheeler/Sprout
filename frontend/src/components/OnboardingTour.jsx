import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { completeOnboarding } from "../api/auth";
import askMeAnythingImg from "../assets/askmeanything.png";

export default function OnboardingTour({ user, onComplete, setUser}) {

  useEffect(() => {

    if (!user) return;
    if (user.hasSeenOnboarding) return;
    const userKey = user.id ?? user.uid;
    if (!userKey) return;

    const createStep = (title, text) => ({
      popover: {
        title,
        description: `
          <div style="
            text-align:center;
            padding:8px;
          ">
            <img 
              src="${askMeAnythingImg}" 
              style="
                width:180px;
                margin-bottom:12px;
                border-radius:12px;
              "
            />
            <p style="
              font-size:14px;
              line-height:1.5;
              color:#555;
              margin:0;
            ">
              ${text}
            </p>
          </div>
        `
      }
    });

    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.6,

      popoverClass: "sprout-tour-popover",

      steps: [

        {
          element: "body",
          ...createStep(
            "Welcome to Sprout 🌱",
            "Sprout helps you organize your life, track habits, and manage important areas like finances, notes, and health."
          )
        },

        {
          element: ".budget-tour",
          ...createStep(
            "Budget Tracker",
            "Track expenses, set budgets, and understand where your money goes each month."
          )
        },

        {
          element: ".diet-tour",
          ...createStep(
            "Diet Tracking",
            "Monitor your meals and nutrition to build healthier habits."
          )
        },

        {
          element: ".schedule-tour",
          ...createStep(
            "Schedule",
            "Stay organized with events, reminders, and upcoming tasks."
          )
        },

        {
          element: ".notes-tour",
          ...createStep(
            "Notes",
            "Capture ideas, journal entries, or important reminders."
          )
        },

        {
          element: ".explore-tour",
          ...createStep(
            "Explore Habitat",
            "Complete goals and be consistent to help Sprout grow his habitat and unlock new features!"
          )
        }

      ],

     onDestroyed: async () => {
      localStorage.setItem(`hasSeenOnboarding_${userKey}`, "true");

      try {
        await completeOnboarding();
      } catch (error) {
        console.error("Failed to persist onboarding completion", error);
      }

      if (setUser) {
        setUser(prev => ({
          ...prev,
          hasSeenOnboarding: true
        }));
      }

      if (onComplete) onComplete();
    }

    });

    setTimeout(() => {
      driverObj.drive();
    }, 300);

  }, [user, onComplete, setUser]);

  return null;
}
