import { useState, useRef, useEffect } from 'react';

export default function DietCard({ diets = [], selectedDiet, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-[260px]">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="sprout-panel w-full flex justify-between items-center px-4 py-2 hover:bg-yellow-50 transition"
      >
        <span className="text-amber-900 font-medium truncate">
          {selectedDiet?.name || 'Select Diet'}
        </span>

        <span className={`transition ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-full sprout-panel overflow-hidden shadow-lg">
          {diets.map((diet) => {
            const active = selectedDiet?.id === diet.id;

            return (
              <button
                key={diet.id}
                onClick={() => {
                  onSelect(diet);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 transition
                  ${
                    active
                      ? 'bg-yellow-200 text-amber-900'
                      : 'hover:bg-yellow-50 text-amber-900'
                  }
                `}
              >
                {diet.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
