import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import { useStore } from "../../state/store.jsx";
import { requiredText } from "../../lib/validators.js";
import { loginUser } from "../../api/auth";

export default function Login() {
  const { dispatch } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const nav = useNavigate();
  const loc = useLocation();

  const goTo = useMemo(
    () => (loc.state?.from ? String(loc.state.from) : "/"),
    [loc.state]
  );

  const onSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  const err = requiredText("Email", email);
  if (err) return setError(err);

  if (!password) {
    return setError("Password is required");
  }

  try {
    const user = await loginUser(email, password);

    // ✅ log success response from backend
    console.log("Login success:", user);

    dispatch({ type: "auth/login", payload: user });

    nav(goTo, { replace: true });

  } catch (err) {
    // ❌ log error from backend
    console.log("Login error:", err.message);

    setError(err.message);
  }
};

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 40 }}>
      <Card title="Login">
        <form onSubmit={onSubmit}>

          <Field label="Email" error={error}>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" error={error}>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <div className="row">
            <Button type="submit">Login</Button>
            <div className="spacer" />
            <Link className="muted" to="/register">
              Need an account? Register
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
}
