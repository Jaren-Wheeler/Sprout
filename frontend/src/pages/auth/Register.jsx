import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import { useStore } from "../../state/store.jsx";
import { requiredText } from "../../lib/validators.js";

export default function Register() {
  const { dispatch } = useStore();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const err = requiredText("Email", email);
    if (err) return setError(err);

    dispatch({ type: "auth/register", payload: { email, display_name: displayName } });
    nav("/", { replace: true });
  };

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 40 }}>
      <Card title="Register" subtitle="Stubbed registration (no real password hashing).">
        <form onSubmit={onSubmit}>
          <Field label="Email" error={error}>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>

          <Field label="Display name (optional)">
            <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>

          <div className="row">
            <Button type="submit">Create account</Button>
            <div className="spacer" />
            <Link className="muted" to="/login">Back to login</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
