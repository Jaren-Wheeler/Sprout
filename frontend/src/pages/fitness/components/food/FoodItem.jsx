import { Trash2 } from 'lucide-react';

export default function FoodItem({ item, onDelete }) {
  const mealLabel =
    item.meal?.charAt(0).toUpperCase() + item.meal?.slice(1).toLowerCase();

  return (
    <div className="sprout-panel p-4 flex items-center justify-between gap-3 overflow-hidden">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-amber-900 truncate">{item.name}</h3>
        <p className="text-xs text-amber-900/60">{mealLabel}</p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <p className="font-semibold text-amber-900 whitespace-nowrap">
          {item.calories} cal
        </p>

        <button
          onClick={onDelete}
          className="sprout-icon-btn-danger"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
