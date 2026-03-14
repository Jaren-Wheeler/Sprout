import { useMemo, useState } from 'react';
import SproutModal from '../../../../components/ui/SproutModal';
import scaleNutrition from '../../../../utils/scaleNutrition';
import FoodSearch from './FoodSearch';
import ManualFoodForm from './ManualFoodForm';

export default function AddDietItemModal({ isOpen, meal, onClose, onCreate }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [manualFood, setManualFood] = useState(null);
  const [grams, setGrams] = useState(100);
  const [mode, setMode] = useState('search');

  const activeFood = mode === 'search' ? selectedFood : manualFood;

  const scaled = useMemo(() => {
    if (!activeFood) return null;

    if (mode === 'manual') {
      return {
        calories: activeFood.calories,
        protein: activeFood.protein,
        carbs: activeFood.carbs,
        fat: activeFood.fat,
        sugar: activeFood.sugar,
      };
    }

    return scaleNutrition(activeFood, grams);
  }, [activeFood, grams, mode]);

  if (!isOpen) return null;

  function isManualFoodValid(food) {
    if (!food) return false;

    return (
      food.name?.trim() &&
      Number.isFinite(food.calories) &&
      food.calories >= 0 &&
      Number.isFinite(food.protein) &&
      food.protein >= 0 &&
      Number.isFinite(food.carbs) &&
      food.carbs >= 0 &&
      Number.isFinite(food.fat) &&
      food.fat >= 0 &&
      Number.isFinite(food.sugar) &&
      food.sugar >= 0
    );
  }

  const canSubmit =
    mode === 'search'
      ? Boolean(selectedFood && scaled)
      : Boolean(isManualFoodValid(manualFood));

  function resetState() {
    setSelectedFood(null);
    setManualFood(null);
    setGrams(100);
    setMode('search');
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function switchMode(newMode) {
    setMode(newMode);
    setSelectedFood(null);
    setManualFood(null);
    setGrams(100);
  }

  function handleGramChange(value) {
    const parsed = Number(value);
    setGrams(Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
  }

  async function submit(isPreset) {
    if (!canSubmit || !activeFood || !scaled) return;

    await onCreate({
      name: activeFood.name.trim(),
      meal,
      calories: scaled.calories,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fat: scaled.fat,
      sugar: scaled.sugar,
      quantity: mode === 'search' ? grams : 1,
      unit: mode === 'search' ? 'g' : 'serving',
      isPreset,
    });

    handleClose();
  }

  return (
    <SproutModal onClose={handleClose}>
      <div className="sprout-panel w-full max-w-lg p-6 shadow-lg">
        <div className="space-y-5">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold text-amber-900">
              Log a food item
            </h2>
            <p className="text-sm text-amber-900/60">
              Add food for {meal?.toLowerCase?.() || 'this meal'}
            </p>
          </div>

          {/* Segmented Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-2xl bg-stone-200 p-1">
              <button
                onClick={() => switchMode('search')}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === 'search'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Search Food
              </button>

              <button
                onClick={() => switchMode('manual')}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === 'manual'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Manual Entry
              </button>
            </div>
          </div>

          {/* Search Mode */}
          {mode === 'search' && <FoodSearch onSelect={setSelectedFood} />}

          {/* Manual Mode */}
          {mode === 'manual' && <ManualFoodForm onChange={setManualFood} />}

          {/* USDA Preview Only */}
          {mode === 'search' && activeFood && scaled && (
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm">
              {/* Food header */}
              <div className="mb-3">
                <div className="font-semibold text-lg text-amber-900">
                  {activeFood.name}
                </div>

                {activeFood.brand && (
                  <div className="text-xs text-amber-900/60">
                    {activeFood.brand}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-amber-900/70 mb-1">
                  Amount (grams)
                </label>

                <input
                  className="sprout-input max-w-[120px]"
                  type="number"
                  min="1"
                  value={grams}
                  onChange={(e) => handleGramChange(e.target.value)}
                />
              </div>

              {/* Nutrition grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-amber-50 px-3 py-2">
                  <div className="text-xs text-amber-900/60">Calories</div>
                  <div className="font-semibold text-amber-900">
                    {scaled.calories}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2">
                  <div className="text-xs text-amber-900/60">Protein</div>
                  <div className="font-semibold text-amber-900">
                    {scaled.protein} g
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2">
                  <div className="text-xs text-amber-900/60">Carbs</div>
                  <div className="font-semibold text-amber-900">
                    {scaled.carbs} g
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2">
                  <div className="text-xs text-amber-900/60">Fat</div>
                  <div className="font-semibold text-amber-900">
                    {scaled.fat} g
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 px-3 py-2 col-span-2">
                  <div className="text-xs text-amber-900/60">Sugar</div>
                  <div className="font-semibold text-amber-900">
                    {scaled.sugar} g
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="sprout-btn-muted px-4"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => submit(false)}
              className="sprout-btn-primary px-4 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSubmit}
            >
              Add Food
            </button>

            <button
              type="button"
              onClick={() => submit(true)}
              className="sprout-btn-success px-4 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSubmit}
            >
              Save Preset
            </button>
          </div>
        </div>
      </div>
    </SproutModal>
  );
}
