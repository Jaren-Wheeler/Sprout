// frontend/src/components/PageShell.jsx
import React from "react";
import "../styles/layout/appPages.css";

export default function PageShell({ title, subtitle, right, children }) {
  return (
    <div className="page">
      <section className="panel">
        {(title || subtitle || right) && (
          <header className="pageHeader">
            <div className="pageHeaderText">
              {title ? <h1 className="pageTitle">{title}</h1> : null}
              {subtitle ? <div className="pageSubtitle">{subtitle}</div> : null}
            </div>

            <div className="pageHeaderRight">{right}</div>
          </header>
        )}

        <div className="pageBody">{children}</div>
      </section>
    </div>
  );
}