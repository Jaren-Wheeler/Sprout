import { useState } from 'react';
import SproutModal from '../../../../components/ui/SproutModal';
import FoodSearch from './FoodSearch';

export default function AddDietItemModal({ isOpen, meal, onClose, onCreate }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState(100);

  if (!isOpen) return null;

  const scaled = selectedFood
    ? {
        calories: Math.round((selectedFood.calories || 0) * (grams / 100)),
        protein: (((selectedFood.protein || 0) * grams) / 100).toFixed(1),
        carbs: (((selectedFood.carbs || 0) * grams) / 100).toFixed(1),
        fat: (((selectedFood.fat || 0) * grams) / 100).toFixed(1),
        sugar: (((selectedFood.sugar || 0) * grams) / 100).toFixed(1),
      }
    : null;

  async function submit(isPreset) {
    if (!selectedFood || !scaled) return;

    await onCreate({
      name: selectedFood.name,
      meal,
      calories: Number(scaled.calories),
      protein: Number(scaled.protein),
      carbs: Number(scaled.carbs),
      fat: Number(scaled.fat),
      sugar: Number(scaled.sugar),
      quantity: grams,
      unit: 'g',
      isPreset,
    });

    setSelectedFood(null);
    setGrams(100);
  }

  return (
    <SproutModal onClose={onClose}>
      <div className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-900">
          Log a food item
        </h2>

        <FoodSearch onSelect={setSelectedFood} />

        {selectedFood && (
          <div className="sprout-panel p-4 space-y-3 text-sm">
            <div className="font-semibold text-amber-900">
              {selectedFood.name}
            </div>

            <div className="text-xs text-amber-900/60">
              Nutrition per {selectedFood.servingSize}{' '}
              {selectedFood.servingUnit}
            </div>

            <div>
              <label className="text-xs text-amber-900/70">
                Amount (grams)
              </label>

              <input
                className="sprout-input"
                type="number"
                min="1"
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-amber-900/80">
              <div>Calories: {scaled.calories}</div>
              <div>Protein: {scaled.protein} g</div>
              <div>Carbs: {scaled.carbs} g</div>
              <div>Fat: {scaled.fat} g</div>
              <div>Sugar: {scaled.sugar} g</div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="sprout-btn-muted px-4">
            Cancel
          </button>

          <button
            onClick={() => submit(false)}
            className="sprout-btn-primary px-4"
            disabled={!selectedFood}
          >
            Add Food
          </button>

          <button
            onClick={() => submit(true)}
            className="sprout-btn-success px-4"
            disabled={!selectedFood}
          >
            Save Preset
          </button>
        </div>
      </div>
    </SproutModal>
  );
}
