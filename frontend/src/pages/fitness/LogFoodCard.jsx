import { useState } from 'react';
import AddDietItemModal from './AddDietItemModal';
import { addDietItem, addPresetItem } from '../../api/health';

export default function LogFoodCard({ diet, onItemCreated }) {
  const [activeMeal, setActiveMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="sprout-paper p-5 w-full max-w-[260px] space-y-4">
      <h2 className="text-center font-semibold text-amber-900">Log Foods</h2>

      <div
        className="
          grid gap-3
          [&>button]:sprout-card
          [&>button]:py-4
          [&>button]:text-amber-900
          [&>button]:font-semibold
          [&>button]:hover:bg-yellow-50
        "
      >
        <button
          onClick={() => {
            setShowModal(true);
            setActiveMeal('BREAKFAST');
          }}
        >
          Breakfast
        </button>
        <button
          onClick={() => {
            setShowModal(true);
            setActiveMeal('LUNCH');
          }}
        >
          Lunch
        </button>
        <button
          onClick={() => {
            setShowModal(true);
            setActiveMeal('DINNER');
          }}
        >
          Dinner
        </button>
        <button
          onClick={() => {
            setShowModal(true);
            setActiveMeal('SNACKS');
          }}
        >
          Snacks
        </button>
      </div>

      <AddDietItemModal
        isOpen={showModal}
        meal={activeMeal}
        onClose={() => setShowModal(false)}
        onCreate={async (data) => {
          if (!diet?.id) return;

          if (data.isPreset) {
            await addPresetItem({ ...data, id: diet.id });
          }

          const newItem = await addDietItem({ ...data, id: diet.id });

          onItemCreated?.(newItem);
          setShowModal(false);
        }}
      />
    </div>
  );
}
