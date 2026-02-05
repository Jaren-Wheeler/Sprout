// src/components/Modal.jsx
import React, { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";
import "../styles/components/modal.css";

export default function Modal({ open, title, children, onClose, footer }) {
  const titleId = useId();
  const modalRef = useRef(null);

  // Keep the latest onClose without re-running the "open" effect every render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };

    // lock background scroll while modal is open
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);

    // Focus only once when opening (and don't steal focus again on re-renders)
    const t = window.setTimeout(() => {
      const root = modalRef.current;
      if (!root) return;

      // If focus is already inside the modal, do nothing
      const active = document.activeElement;
      if (active && root.contains(active)) return;

      // Prefer focusing the first real form control/button
      const firstFocusable = root.querySelector(
        'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])'
      );

      (firstFocusable || root).focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onCloseRef.current?.();
      }}
    >
      <div
        className="modal"
        ref={modalRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
      >
        <div className="modal__head">
          <div className="h2" id={titleId}>
            {title}
          </div>

          <Button
            variant="ghost"
            onClick={() => onCloseRef.current?.()}
            aria-label="Close"
            title="Close"
          >
            ✕
          </Button>
        </div>

        <div className="modal__body">{children}</div>

        <div className="modal__foot">
          {footer ?? (
            <Button onClick={() => onCloseRef.current?.()}>Close</Button>
          )}
        </div>
      </div>
    </div>
  );
}