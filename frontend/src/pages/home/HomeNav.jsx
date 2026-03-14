import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext.jsx";
import sproutLogo from "../../assets/Logo.png";

export default function HomeNav({ showNav }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        showNav
          ? "opacity-100 translate-y-0 backdrop-blur-md bg-white/70 shadow-md"
          : "opacity-0 -translate-y-6 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={sproutLogo} className="w-10 h-10" />
          <span className="font-[Poppins] text-xl text-[#5b2d0b] font-semibold">
            Sprout
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* Login */}
          <button
            className="font-[Inter] text-[#5b2d0b] hover:opacity-70 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          {/* Signup */}
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-[Inter] shadow-md hover:bg-green-700 transition"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

        </div>
      </div>
    </header>
  );
}