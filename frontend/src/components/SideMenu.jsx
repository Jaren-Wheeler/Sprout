import { Link } from "react-router-dom";

// Standardizing path: src/components/SideMenu.jsx -> src/assets/
import settings from "../assets/settings.png";
import settingshover from "../assets/settings-hover.png";
import scheduler from "../assets/scheduler.png";
import schedulerhover from "../assets/scheduler-hover.png";
import expenses from "../assets/expenses.png";
import expenseshover from "../assets/expenses-hover.png";
import notesIcon from "../assets/notes.png";
import noteshover from "../assets/notes-hover.png";
import fitnessIcon from "../assets/fitness.png";
import fitnesshover from "../assets/fitness-hover.png";

export default function SideMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", src: settings, hover: settingshover },
    { to: "/calendar", label: "Calendar", src: scheduler, hover: schedulerhover },
    { to: "/diet", label: "Fitness", src: fitnessIcon, hover: fitnesshover },
    { to: "/budget", label: "Budgeting", src: expenses, hover: expenseshover },
    { to: "/notes", label: "Notes", src: notesIcon, hover: noteshover },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/5 left" onClick={onClose} />

      <div 
        className="absolute top-16 left-6 z-50 w-64 rounded-2xl shadow-xl border-2 overflow-hidden animate-dropDown"
        style={{ 
          backgroundColor: '#E7FAA2', 
          borderColor: '#4C8038'      
        }} 
      >
        <div className="p-2 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium group text-gray-900"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8ae070'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <img 
                  src={item.src} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-0" 
                />
                <img 
                  src={item.hover} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100" 
                />
              </div>

              <span className="flex-1 text-gray-900">{item.label}</span>
              <span className="opacity-0 group-hover:opacity-100 text-xs transition-opacity text-gray-900">→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}