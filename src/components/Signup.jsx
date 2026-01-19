import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  return (
    <div className={`home ${theme}`}>
      <h1 className="pop show">Sign Up</h1>

      <form className="auth-form pop show delay-1">
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />

        <button className="btn signup" type="submit">
          Create Account
        </button>
      </form>

      <p className="auth-link pop show delay-2">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Log In</span>
      </p>

      {/* Theme toggle */}
      <div className="theme-icons pop show delay-3">
        <span
          className={theme === "light" ? "active" : ""}
          onClick={() => setTheme("light")}
        >
          ☀️
        </span>
        <span
          className={theme === "dark" ? "active" : ""}
          onClick={() => setTheme("dark")}
        >
          🌙
        </span>
      </div>
    </div>
  );
}
