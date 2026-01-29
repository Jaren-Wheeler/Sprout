import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; 

export default function Login() {
  const [theme, setTheme] = useState("light");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Email required");
    if (!password) return setError("Password required");

    try {
      const user = await loginUser(email, password);
      console.log("Login success:", user);

      // Only navigate if login succeeds
      navigate("/dashboard");

    } catch (err) {
      console.log("Login error:", err.message);
      setError(err.message);
    }
  };

  return (
  <div className={`home ${theme}`}>

    <div className="auth-container pop show">

      <h1 className="pop show">Log In</h1>

      <form className="auth-form pop show delay-1" onSubmit={onSubmit}>
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

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>
            {error}
          </div>
        )}

        <button className="btn login" type="submit">
          Log In
        </button>
      </form>

      <p className="auth-link pop show delay-2">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")}>Sign Up</span>
      </p>

      {/*  Toggle  */}
      <div className="theme-icons inline pop show delay-3">
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

  </div>
);


}
