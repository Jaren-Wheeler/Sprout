import { createPortal } from 'react-dom';

export default function SproutModal({
  children,
  onClose,
  level = 50,
  maxWidth = 'max-w-md',
}) {
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      style={{ zIndex: level }}
    >
      {/* click outside */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* modal content */}
      <div
        className={`relative z-10 mx-4 w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-scaleIn pointer-events-auto`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
