import { ChevronDown, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function DietCard({
  diets = [],
  selectedDiet,
  onSelect,
  onCreate,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
    <div ref={ref} className="relative w-[200px]">
      {/* Trigger */}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="sprout-panel w-full flex items-center justify-between px-3 py-2 hover:bg-yellow-50 transition"
      >
        <span className="text-amber-900 font-medium truncate">
          {selectedDiet?.name || 'Select Diet'}
        </span>

        <ChevronDown
          size={18}
          className={`transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 mt-2 w-full sprout-panel shadow-lg overflow-hidden">
          {diets.map((diet) => {
            const active = selectedDiet?.id === diet.id;

            return (
              <div
                key={diet.id}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer
                  ${
                    active
                      ? 'bg-yellow-200 text-amber-900'
                      : 'hover:bg-yellow-50 text-amber-900'
                  }`}
                onClick={() => {
                  onSelect(diet);
                  setOpen(false);
                }}
              >
                <span className="truncate">{diet.name}</span>

                {/* Delete button */}

                <Trash2
                  size={14}
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(diet.id);
                  }}
                />
              </div>
            );
          })}

          {/* Divider */}

          <div className="border-t border-yellow-300/40" />

          {/* Create */}

          <button
            onClick={() => {
              setOpen(false);
              onCreate();
            }}
            className="w-full text-left px-3 py-2 text-green-700 hover:bg-green-50 font-medium"
          >
            + Create Diet
          </button>
        </div>
      )}
    </div>
  );
}
