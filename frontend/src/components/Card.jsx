//src/components/Card.jsx

import React from "react";

export default function Card({ title, subtitle, right, children }) {
  return (
    <div className="card">
      {(title || right || subtitle) && (
        <div className="card__head">
          <div>
            {title && <div className="h2">{title}</div>}
            {subtitle && <div className="muted" style={{ fontSize: 13 }}>{subtitle}</div>}
          </div>
          {right && <div>{right}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
}
