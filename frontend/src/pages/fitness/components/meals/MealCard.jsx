import { Trash2 } from 'lucide-react';

export default function MealCard({ item, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Meal name */}
      <h3 className="font-semibold text-amber-900 truncate">{item.name}</h3>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="sprout-icon-btn-danger"
        title="Delete preset"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
