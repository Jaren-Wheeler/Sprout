import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth"; // adjust path if needed

export default function Signup() {
  const [theme, setTheme] = useState("light");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Email required");
    if (!password) return setError("Password required");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const user = await registerUser(email, password);

      console.log("Register success:", user);

      // redirect????
      navigate("/login");

    } catch (err) {
      console.log("Register error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className={`home ${theme}`}>
      <h1 className="pop show">Sign Up</h1>

      <form
        className="auth-form pop show delay-1"
        onSubmit={onSubmit}
      >
        {/* Full name not used in backend yet */}
        <input
          type="text"
          placeholder="Full Name"
          disabled
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>
            {error}
          </div>
        )}

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
