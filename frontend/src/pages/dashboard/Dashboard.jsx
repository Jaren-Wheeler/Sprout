import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/dashboard.css";
import Sprout from "../../components/chatbot/Sprout";
// Assets
import forest from "../../assets/forest.png";
import forestdark from "../../assets/forestdark.png";
import lightdark from "../../assets/lightdark.png";
import lightdarkhover from "../../assets/lightdark-hover.png";
import lightdark2 from "../../assets/lightdark2.png";
import lightdark2hover from "../../assets/lightdark2-hover.png";
import settings from "../../assets/settings.png";
import settingshover from "../../assets/settings-hover.png";
import scheduler from "../../assets/scheduler.png";
import schedulerhover from "../../assets/scheduler-hover.png";
import expenses from "../../assets/expenses.png";
import expenseshover from "../../assets/expenses-hover.png";
import expensesdark from "../../assets/expensesdark.png";
import expensesdarkhover from "../../assets/expensesdark-hover.png";
import notes from "../../assets/notes.png";
import noteshover from "../../assets/notes-hover.png";
import fitness from "../../assets/fitness.png";
import fitnesshover from "../../assets/fitness-hover.png";
import askmeanything from "../../assets/askmeanything.png";
import askmeanythinghover from "../../assets/askmeanything-hover.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sproutOpen, setSproutOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const items = [
    { id: "settings", src: settings, hoverSrc: settingshover, label: "Settings", route: "/dashboard" },
    { id: "scheduler", src: scheduler, hoverSrc: schedulerhover, label: "Scheduler", route: "/calendar" },
    { 
      id: "expenses", 
      src: isDarkMode ? expensesdark : expenses, 
      hoverSrc: isDarkMode ? expensesdarkhover : expenseshover, 
      label: "Expenses", 
      route: "/budget" 
    },
    { id: "notes", src: notes, hoverSrc: noteshover, label: "Notes", route: "/notes" },
    { id: "fitness", src: fitness, hoverSrc: fitnesshover, label: "Fitness", route: "/diet" },

    { 
      id: "lightdark", 
      src: isDarkMode ? lightdark2 : lightdark, 
      hoverSrc: isDarkMode ? lightdark2hover : lightdarkhover, 
      label: "Toggle Theme",
      isToggle: true 
    }
  ];

  const handleAction = (item) => {
    if (item.isToggle) {
      setIsDarkMode(!isDarkMode);
    } else {
      navigate(item.route);
    }
  };

 return (
  <>
    <div
      className="dashboard-bg"
      style={{ backgroundImage: `url(${isDarkMode ? forestdark : forest})` }}
    >
      <div className="dashboard-container">
        {items.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="dashboard-item-wrapper"
            onClick={() => handleAction(item)}
          >
            <img src={item.src} alt={item.label} className="dashboard-icon normal" />
            <img src={item.hoverSrc} alt="" className="dashboard-icon hover" />
          </div>
        ))}
      </div>

      <footer className="dashboard-footer">
        SPROUT © Jaren, Luke, Chelsea, Romeo.
      </footer>
    </div>
    
    <Sprout />
  
  </>
);


}