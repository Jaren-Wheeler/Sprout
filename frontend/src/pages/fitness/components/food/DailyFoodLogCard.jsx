import { useState } from 'react';
import {
  addDietItem,
  addPresetItem,
  deleteDietItem,
} from '../../../../api/health';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import AddDietItemModal from './AddDietItemModal';
import FoodItem from './FoodItem';

import { format } from 'date-fns';

const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS'];

export default function DailyFoodLogCard({
  diet,
  items,
  setItems,
  date,
  setDate,
}) {
  const [activeMeal, setActiveMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const openMeal = (meal) => {
    if (!diet?.id) return;
    setActiveMeal(meal);
    setShowModal(true);
  };

  function requestDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;

    await deleteDietItem(diet.id, pendingDeleteId);

    setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));

    setConfirmOpen(false);
    setPendingDeleteId(null);
  }

  function prevDay() {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d);
  }

  function nextDay() {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d);
  }

  const formattedDate = format(date, 'MMM d');

  return (
    <div className="sprout-paper p-5 w-full space-y-5">
      {/* HEADER */}

      <div className="relative flex items-center justify-center">
        <h2 className="font-semibold text-amber-900 text-lg">Your Daily Log</h2>

        <p className="absolute right-0 text-sm text-amber-900/60">
          {(items || []).length} items
        </p>
      </div>

      {/* DATE SELECTOR */}

      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={prevDay}
          className="sprout-card px-3 py-1 text-amber-900"
        >
          ←
        </button>

        <span className="font-semibold text-amber-900">{formattedDate}</span>

        <button
          onClick={nextDay}
          className="sprout-card px-3 py-1 text-amber-900"
        >
          →
        </button>
      </div>

      {/* CATEGORY BUTTONS */}

      <div className="relative flex items-center justify-center gap-2">
        {MEALS.map((meal) => (
          <button
            key={meal}
            onClick={() => openMeal(meal)}
            className="
              sprout-card
              px-4 py-2
              text-sm
              font-semibold
              text-amber-900
              hover:bg-yellow-50
              capitalize
            "
          >
            {meal.toLowerCase()}
          </button>
        ))}
      </div>

      {/* FOOD ITEMS LIST */}

      <div className="space-y-3">
        {(items || []).length === 0 ? (
          <div className="sprout-panel p-4 text-amber-900/70">
            Nothing logged for this day.
          </div>
        ) : (
          items.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onDelete={() => requestDelete(item.id)}
            />
          ))
        )}
      </div>

      {/* ADD FOOD MODAL */}

      <AddDietItemModal
        isOpen={showModal}
        meal={activeMeal}
        onClose={() => setShowModal(false)}
        onCreate={async (data) => {
          if (!diet?.id) return;

          let newItem;

          const payload = {
            ...data,
            id: diet.id,
            loggedAt: date,
          };

          if (data.isPreset) {
            newItem = await addPresetItem(payload);
          } else {
            newItem = await addDietItem(payload);
          }
          console.log('Payload:', payload);

          setItems((prev) => [newItem, ...prev]);

          setShowModal(false);
        }}
      />

      {/* DELETE CONFIRMATION */}

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
