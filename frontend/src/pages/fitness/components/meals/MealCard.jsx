import { Trash2 } from 'lucide-react';

export default function MealCard({ item, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-amber-900 overflow-hidden text-ellipsis whitespace-nowrap">
          {item.name}
        </h3>
        <p className="text-xs text-amber-900/60">{item.calories} cal</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="sprout-icon-btn-danger flex-shrink-0"
        title="Delete preset"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
