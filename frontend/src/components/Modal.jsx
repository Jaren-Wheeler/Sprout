import React, { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";
import "../styles/components/modal.css";

export default function Modal({ open, title, children, onClose, footer }) {
  const titleId = useId();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    // lock background scroll while modal is open
    document.body.classList.add("modal-open");

    window.addEventListener("keydown", onKey);

    // focus the modal for accessibility
    setTimeout(() => {
      modalRef.current?.focus?.();
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose?.();
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
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            ✕
          </Button>
        </div>

        <div className="modal__body">{children}</div>

        <div className="modal__foot">
          {footer ?? <Button onClick={onClose}>Close</Button>}
        </div>
      </div>
    </div>
  );
}