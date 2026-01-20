import React from "react";

export default function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      <div className="field__labelRow">
        <label className="field__label">{label}</label>
        {hint && <span className="field__hint">{hint}</span>}
      </div>
      {children}
      {error && <div className="field__error">{error}</div>}
    </div>
  );
}
