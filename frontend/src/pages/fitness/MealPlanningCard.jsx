import { useEffect, useState } from 'react';
import {
  getPresetItems,
  addDietItem,
  deletePresetItem,
} from '../../api/health';
import ConfirmModal from '../../components/ui/ConfirmModal';
import MealCard from './MealCard';

export default function MealPlanningCard({ diet, onAddDietItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    async function loadItems() {
      if (!diet?.id) return;

      try {
        setLoading(true);
        const data = await getPresetItems(diet.id);
        setItems(data ?? []);
      } catch (err) {
        console.error('Failed to load preset items', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [diet?.id]);

  async function handleUsePreset(preset) {
    if (!diet?.id) return;

    try {
      const newItem = await addDietItem({
        id: diet.id,
        name: preset.name,
        meal: preset.meal,
        calories: preset.calories,
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat,
        sugar: preset.sugar,
      });

      onAddDietItem?.(newItem);
    } catch (err) {
      console.error('Failed to add diet item from preset', err);
    }
  }

  function requestDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!diet?.id || !pendingDeleteId) return;

    try {
      await deletePresetItem(diet.id, pendingDeleteId);
      setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    } catch (err) {
      console.error('Failed to delete preset item', err);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="sprout-paper p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-amber-900">Your Saved Meals</h2>
        <p className="text-sm text-amber-900/60">{items.length} saved</p>
      </div>

      {loading ? (
        <div className="sprout-panel p-4 text-amber-900/70">
          Loading presets...
        </div>
      ) : items.length === 0 ? (
        <div className="sprout-panel p-4 text-amber-900/70">
          No presets yet. Save a food item as a preset to reuse it quickly.
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {items.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleUsePreset(p)}
              className="sprout-card p-3 min-w-[220px] text-left"
            >
              <MealCard item={p} onDelete={() => requestDelete(p.id)} />
            </button>
          ))}
        </div>
      )}

      {confirmOpen && (
        <ConfirmModal
          title="Delete saved meal?"
          message="This will remove the preset, but it will not delete anything from your daily log."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => {
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
