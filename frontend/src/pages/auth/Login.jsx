import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import { useStore } from "../../state/store.jsx";
import { requiredText } from "../../lib/validators.js";

export default function Login() {
  const { state, dispatch } = useStore();
  const [email, setEmail] = useState("demo@sprout.local");
  const [error, setError] = useState(null);

  const nav = useNavigate();
  const loc = useLocation();
  const goTo = useMemo(() => (loc.state?.from ? String(loc.state.from) : "/"), [loc.state]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const err = requiredText("Email", email);
    if (err) return setError(err);

    const exists = state.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) return setError("No user found for that email (prototype stub). Try demo@sprout.local");

    dispatch({ type: "auth/login", payload: { email } });
    nav(goTo, { replace: true });
  };

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 40 }}>
      <Card title="Login" subtitle="Stubbed auth (no real password/JWT).">
        <form onSubmit={onSubmit}>
          <Field label="Email" error={error}>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>

          <div className="row">
            <Button type="submit">Login</Button>
            <div className="spacer" />
            <Link className="muted" to="/register">Need an account? Register</Link>
          </div>

          <div className="hr" />
          <div className="muted" style={{ fontSize: 13 }}>
            Tip: use <span className="kbd">demo@sprout.local</span>
          </div>
        </form>
      </Card>
    </div>
  );
}
