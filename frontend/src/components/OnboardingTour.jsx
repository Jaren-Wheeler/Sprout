import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function OnboardingTour() {

  useEffect(() => {

    const hasSeenTour = localStorage.getItem("hasSeenTour");

    if (hasSeenTour) return;

    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      steps: [
        {
          element: "body",
          popover: {
            title: "Welcome to Sprout 🌱",
            description: "Let's take a quick tour of your dashboard."
          }
        },
        {
          element: ".budget-tour",
          popover: {
            title: "Budget Tracker",
            description: "Track your expenses and manage your finances here."
          }
        },
        {
          element: ".diet-tour",
          popover: {
            title: "Diet Tracking",
            description: "Monitor your meals and nutrition progress."
          }
        },
        {
          element: ".schedule-tour",
          popover: {
            title: "Schedule",
            description: "View and manage your calendar events."
          }
        },
        {
          element: ".notes-tour",
          popover: {
            title: "Notes",
            description: "Write and store notes for later."
          }
        },
        {
          element: ".explore-tour",
          popover: {
            title: "Explore Habitat",
            description: "Accomplish goals, be consistent, and help Sprout grow his habitat. Explore the habitat for more."
          }
        }
      ],

      onDestroyed: () => {
        localStorage.setItem("hasSeenTour", "true");
      }

    });

    driverObj.drive();

  }, []);

  return null;
}