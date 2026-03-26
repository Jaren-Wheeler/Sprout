import logo from "../assets/Logo.png";
import { useTheme } from "../theme/ThemeContext";

export default function Header({
  title,
  onMenuClick,
  className = "",
  buttonClassName = "",
}) {
  const { theme, setTheme } = useTheme();

  return (
    <header className={`relative z-20 flex items-center justify-between border-b border-[rgba(128,86,36,0.1)] px-4 py-4 dark:border-white/10 md:px-6 md:py-5 ${className}`.trim()}>
      <button
        onClick={onMenuClick}
        className={`flex h-20 w-20 items-center justify-center rounded-[26px] border border-[rgba(128,86,36,0.12)] bg-white/70 shadow-[0_12px_24px_rgba(87,60,26,0.08)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_16px_28px_rgba(87,60,26,0.12)] dark:border-white/10 dark:bg-white/8 dark:shadow-[0_12px_24px_rgba(0,0,0,0.35)] ${buttonClassName}`.trim()}
        aria-label="Open navigation"
      >
        <img
          src={logo}
          alt="Sprout logo"
          className="h-16 w-16 object-contain"
        />
      </button>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-[rgba(128,86,36,0.14)] bg-white/70 p-1 shadow-[0_10px_20px_rgba(87,60,26,0.08)] dark:border-white/10 dark:bg-white/8 dark:shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              theme === "light"
                ? "bg-[#f4e4a8] text-[#5a3012] shadow-[0_6px_14px_rgba(212,148,31,0.18)]"
                : "text-[rgba(74,51,32,0.62)] hover:text-[#5a3012] dark:text-white/55 dark:hover:text-white"
            }`}
            aria-pressed={theme === "light"}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              theme === "dark"
                ? "bg-[#2e3545] text-white shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                : "text-[rgba(74,51,32,0.62)] hover:text-[#5a3012] dark:text-white/55 dark:hover:text-white"
            }`}
            aria-pressed={theme === "dark"}
          >
            Dark
          </button>
        </div>
      </div>
    </header>
  );
}
