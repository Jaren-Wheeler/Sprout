import React, { useEffect } from "react";
import Button from "./Button.jsx";

export default function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__head">
          <div className="h2">{title}</div>
          <Button variant="ghost" onClick={onClose} aria-label="Close">✕</Button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__foot">
          {footer ?? <Button onClick={onClose}>Close</Button>}
        </div>
      </div>
    </div>
  );
}
