import { createPortal } from 'react-dom';

export default function SproutModal({
  children,
  onClose,
  level = 50,
  maxWidth = 'max-w-md',
}) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: level }}
    >
      {/* click outside */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* modal content */}
      <div
        className={`relative z-10 w-full ${maxWidth} mx-4 animate-scaleIn max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
