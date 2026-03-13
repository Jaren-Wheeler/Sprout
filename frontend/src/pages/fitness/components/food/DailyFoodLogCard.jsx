import { useState } from 'react';
import {
  addDietItem,
  addPresetItem,
  deleteDietItem,
} from '../../../../api/health';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import AddDietItemModal from './AddDietItemModal';
import DietCard from './DietCard';
import FoodItem from './FoodItem';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS'];

export default function DailyFoodLogCard({
  diet,
  diets,
  onSelectDiet,
  onDeleteDiet,
  openCreateDiet,
  items,
  addDietItemLocal,
  removeDietItemLocal,
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

    removeDietItemLocal(pendingDeleteId);

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
    <div className="sprout-paper p-5 w-full h-[540px] flex flex-col min-w-0 overflow-hidden">
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="font-semibold text-amber-900 text-lg">Your Daily Log</h2>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button onClick={prevDay}>
            <ChevronLeft size={22} />
          </button>

          <span className="font-semibold text-amber-900 text-lg">
            {formattedDate}
          </span>

          <button onClick={nextDay}>
            <ChevronRight size={22} />
          </button>
        </div>

        <DietCard
          diets={diets}
          selectedDiet={diet}
          onSelect={onSelectDiet}
          onCreate={openCreateDiet}
          onDelete={onDeleteDiet}
        />
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-yellow-300/40">
        {MEALS.map((meal) => (
          <button
            key={meal}
            onClick={() => openMeal(meal)}
            className="sprout-card px-4 py-2 text-sm font-semibold text-amber-900 capitalize"
          >
            {meal.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-2">
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

      <AddDietItemModal
        isOpen={showModal}
        meal={activeMeal}
        onClose={() => setShowModal(false)}
        onCreate={async (data) => {
          if (!diet?.id) return;

          const payload = {
            ...data,
            id: diet.id,
            loggedAt: date,
          };

          if (data.isPreset) {
            await addPresetItem(payload);
          } else {
            const newItem = await addDietItem(payload);
            addDietItemLocal(newItem);
          }

          setShowModal(false);
        }}
      />

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
