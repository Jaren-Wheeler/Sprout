import { useState } from 'react';
import { deleteDietItem } from '../../api/health';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FoodItem from './FoodItem';

export default function FoodListCard({ diet, items, setItems }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function requestDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;

    try {
      await deleteDietItem(diet.id, pendingDeleteId);
      setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    } catch (err) {
      console.error('Failed to delete diet item', err);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="sprout-paper p-5 w-full max-w-[420px] max-h-[520px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-amber-900">Your Daily Log</h2>
        <p className="text-sm text-amber-900/60">
          {(items || []).length} items
        </p>
      </div>

      <div className="space-y-3">
        {(items || []).length === 0 ? (
          <div className="sprout-panel p-4 text-amber-900/70">
            Nothing logged yet. Add something from the meal buttons.
          </div>
        ) : (
          (items || []).map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onDelete={() => requestDelete(item.id)}
            />
          ))
        )}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Delete food item?"
          message="This will remove the item from your daily log."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => {
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
