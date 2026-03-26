import logo from "../assets/Logo.png";

export default function Header({
  title,
  onMenuClick,
  className = "",
  buttonClassName = "",
}) {
  return (
    <header className={`relative z-20 flex items-center border-b border-[rgba(128,86,36,0.1)] px-4 py-4 md:px-6 md:py-5 ${className}`.trim()}>
      <button
        onClick={onMenuClick}
        className={`flex h-20 w-20 items-center justify-center rounded-[26px] border border-[rgba(128,86,36,0.12)] bg-white/70 shadow-[0_12px_24px_rgba(87,60,26,0.08)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_16px_28px_rgba(87,60,26,0.12)] ${buttonClassName}`.trim()}
        aria-label="Open navigation"
      >
        <img
          src={logo}
          alt="Sprout logo"
          className="h-16 w-16 object-contain"
        />
      </button>
    </header>
  );
}
