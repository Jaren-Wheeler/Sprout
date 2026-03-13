import { useEffect, useState } from 'react';
import {
  addDietItem,
  deletePresetItem,
  getPresetItems,
} from '../../../../api/health';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
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
        loggedAt: new Date(),
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
    <div className="sprout-paper p-5 h-[540px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-amber-900">Your Preset Foods</h2>
        <p className="text-sm text-amber-900/60">{items.length} saved</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin min-h-0">
        <div className="space-y-2">
          {loading ? (
            <div className="sprout-panel p-4 text-amber-900/70">
              Loading presets...
            </div>
          ) : items.length === 0 ? (
            <div className="sprout-panel p-4 text-amber-900/70">
              No presets yet.
            </div>
          ) : (
            items.map((p) => (
              <div
                key={p.id}
                onClick={() => handleUsePreset(p)}
                className="sprout-card p-3 cursor-pointer hover:bg-yellow-50"
              >
                <MealCard item={p} onDelete={() => requestDelete(p.id)} />
              </div>
            ))
          )}
        </div>
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Delete saved meal?"
          message="This will remove the preset."
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
