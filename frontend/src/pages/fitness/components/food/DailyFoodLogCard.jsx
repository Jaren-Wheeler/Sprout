import { useState } from 'react';
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
  addDietItem,
  deleteDietItem,
  date,
  setDate,
  addPreset,
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

    await deleteDietItem(pendingDeleteId);

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
    <div className="w-full h-[540px] flex items-center justify-center -rotate-1 rounded-[28px] bg-white p-4 shadow-[0_18px_40px_rgba(87,60,26,0.08)]">
      <div className="sprout-paper p-5 w-full h-full flex flex-col min-w-0 overflow-hidden">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-amber-200/50 pb-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-amber-900 whitespace-nowrap">
                Your Daily Log
              </h2>
              <p className="mt-1 text-sm text-amber-900/55">
                Choose a diet and log meals for the day.
              </p>
            </div>

            <div className="max-w-[240px]">
              <DietCard
                diets={diets}
                selectedDiet={diet}
                onSelect={onSelectDiet}
                onCreate={openCreateDiet}
                onDelete={onDeleteDiet}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/50 px-3 py-1">
            <button
              onClick={prevDay}
              className="text-amber-700 transition-colors hover:text-amber-900"
            >
              <ChevronLeft size={22} />
            </button>

            <span className="font-bold text-amber-900 text-md min-w-[65px] text-center">
              {formattedDate}
            </span>

            <button onClick={nextDay}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-yellow-300/40">
          {MEALS.map((meal) => (
            <button
              key={meal}
              onClick={() => openMeal(meal)}
              className="sprout-card px-4 py-2 text-sm font-semibold text-amber-900 capitalize hover:bg-amber-100/50 transition-all"
            >
              {meal.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-2">
          {(items || []).length === 0 ? (
            <div>
              <div className="sprout-panel p-8 text-amber-900/60 text-center italic border-2 border-dashed border-amber-200/50 rounded-xl">
                Nothing logged today.
              </div>
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
              await addPreset(payload);
            } else {
              await addDietItem(payload);
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
    </div>
   
  );
}
