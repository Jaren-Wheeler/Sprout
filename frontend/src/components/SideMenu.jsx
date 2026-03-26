import { Link, useNavigate } from "react-router-dom";

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

export default function SideMenu({ isOpen, onClose, setUser }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", src: settings, hover: settingshover },
    { to: "/calendar", label: "Calendar", src: scheduler, hover: schedulerhover },
    { to: "/diet", label: "Fitness", src: fitnessIcon, hover: fitnesshover },
    { to: "/budget", label: "Budgeting", src: expenses, hover: expenseshover },
    { to: "/notes", label: "Notes", src: notesIcon, hover: noteshover },
  ];

  const handleLogout = () => {
    localStorage.removeItem("sprout_user");

    if (setUser) setUser(null);
  
    onClose();
    navigate("/");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] dark:bg-black/40"
        onClick={onClose}
      />

      <div
        className="absolute left-10 top-24 z-50 w-72 overflow-hidden rounded-[28px] border animate-dropDown border-[rgba(103,161,79,0.32)] bg-[linear-gradient(180deg,rgba(250,252,239,0.98),rgba(238,245,213,0.96))] shadow-[0_26px_54px_rgba(87,60,26,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(25,30,40,0.98),rgba(18,22,31,0.96))] dark:shadow-[0_26px_54px_rgba(0,0,0,0.45)]"
      >
        <div className="border-b border-[rgba(103,161,79,0.14)] px-5 py-4 dark:border-white/8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#55713c]/80 dark:text-[#b8d6a3]/80">
            Menu
          </p>
          <p className="mt-1 text-sm text-[#4f5f34]/80 dark:text-white/65">
            Jump between your spaces.
          </p>
        </div>

        <div className="p-3 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3 font-medium text-gray-900 transition-all group hover:border-white/50 hover:bg-white/55 hover:shadow-[0_10px_20px_rgba(87,60,26,0.08)] dark:text-white/90 dark:hover:border-white/10 dark:hover:bg-white/8 dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.22)]"
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

              <span className="flex-1 text-gray-900 dark:text-white/88">{item.label}</span>
              <span className="opacity-0 group-hover:opacity-100 text-xs transition-opacity text-[#5b7a42] dark:text-[#b8d6a3]">
                View
              </span>
            </Link>
          ))}

          <div className="mt-2 border-t border-[#4C8038]/20 pt-2 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-2xl px-4 py-3 font-medium text-red-700 transition-all group hover:bg-white/55 dark:text-[#f09b9b] dark:hover:bg-white/8"
            >
              <span className="flex-1 text-left">Log Out</span>
              <span className="opacity-0 group-hover:opacity-100 text-xs transition-opacity">
                Exit
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
