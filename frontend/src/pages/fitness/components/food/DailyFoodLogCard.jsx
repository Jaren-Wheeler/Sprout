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
    <div className="bg-white w-full h-[540px] flex items-center justify-center -rotate-1">
      <div className="sprout-paper p-5 w-[90%] h-[90%] flex flex-col min-w-0 overflow-hidden ">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-amber-200/50 pb-4">
          <h2 className="font-bold text-amber-900 text-xl whitespace-nowrap">Your Daily Log</h2>

          <div className="flex items-center gap-2 bg-amber-50/50 px-3 py-1 rounded-full border border-amber-100">
            <button onClick={prevDay}
            className="text-amber-700 hover:text-amber-900 transition-colors">
              <ChevronLeft size={22} />
            </button>

            <span className="font-bold text-amber-900 text-md min-w-[65px] text-center">
              {formattedDate}
            </span>

            <button onClick={nextDay}>
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex-shrink-0"> 
            <DietCard
              diets={diets}
              selectedDiet={diet}
              onSelect={onSelectDiet}
              onCreate={openCreateDiet}
              onDelete={onDeleteDiet}
            />
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
