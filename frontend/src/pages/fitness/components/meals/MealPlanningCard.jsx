import { useState } from 'react';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import MealCard from './MealCard';

export default function MealPlanningCard({
  presets,
  presetsLoading,
  usePreset,
  removePreset,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function requestDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;

    try {
      await removePreset(pendingDeleteId);
    } catch (err) {
      console.error('Failed to delete preset', err);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="w-full h-[540px] flex items-center justify-center rotate-1 rounded-[28px] bg-white p-4 shadow-[0_18px_40px_rgba(87,60,26,0.08)]">
      <div className="sprout-paper p-5 w-full h-full flex flex-col min-w-0 overflow-hidden">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-amber-200/50 pb-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-xl font-bold text-amber-900">
              Your Preset Foods
            </h2>
            <p className="text-sm text-amber-900/55">
              Save foods you want to log again quickly.
            </p>
          </div>
          <p className="text-sm text-amber-900/60">{presets.length} saved</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin min-h-0">
          <div className="space-y-2">
            {presetsLoading ? (
              <div className="sprout-panel p-4 text-amber-900/70 text-center">
                Loading presets...
              </div>
            ) : presets.length === 0 ? (
              <div className="sprout-panel p-8 text-amber-900/60 text-center italic border-2 border-dashed border-amber-200/50 rounded-xl">
                No presets yet.
              </div>
            ) : (
              presets.map((p) => (
                <div
                  key={p.id}
                  onClick={() => usePreset(p)}
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
    </div>
    
  );
}
