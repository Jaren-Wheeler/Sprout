import { createPortal } from "react-dom";

export default function SproutModal({ children, onClose, level = 50 }) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: level }}
    >
      {/* Click outside */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scaleIn">
        {children}
      </div>
    </div>,
    document.body
  );
}