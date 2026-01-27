import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  return (
    <div className={`home ${theme}`}>
      <h1 className="pop show">Log In</h1>

      <form className="auth-form pop show delay-1">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button  className="btn login" type="submit" onClick={() => navigate("/dashboard")}>
          Log In
        </button>
      </form>

      <p className="auth-link pop show delay-2">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")}>Sign Up</span>
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