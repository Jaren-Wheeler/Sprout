// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useTheme } from "../state/theme.jsx";

export default function Login() {
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {};
    const emailTrimmed = email.trim().toLowerCase();

    if (!emailTrimmed) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(emailTrimmed))
      newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      const user = await loginUser(emailTrimmed, password);

      try {
        localStorage.setItem(
          "sprout_user",
          JSON.stringify({
            email: emailTrimmed,
            ...(user?.id ? { id: user.id } : {}),
          })
        );
      } catch {
        // ignore
      }

      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: err.message || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`home ${theme}`}>
      <div className="auth-container pop show">
        <h1 className="pop show">Log In</h1>

        <form className="auth-form pop show delay-1" onSubmit={onSubmit}>
          <div className="field-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div className="field-error">{errors.email || ""}</div>
          </div>

          <div className="field-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="field-error">{errors.password || ""}</div>
          </div>

          {errors.form && <div className="error-box">{errors.form}</div>}

          <button className="btn login" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-link pop show delay-2">
          Don’t have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>

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