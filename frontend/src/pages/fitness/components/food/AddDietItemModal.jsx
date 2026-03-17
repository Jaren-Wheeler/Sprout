import { useMemo, useState } from 'react';

import SproutModal from '../../../../components/ui/SproutModal';
import scaleNutrition from '../../../../utils/scaleNutrition';

import FoodSearch from './FoodSearch';
import ManualFoodForm from './ManualFoodForm';

export default function AddDietItemModal({ isOpen, meal, onClose, onCreate }) {
  const emptyFood = {
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    sugar: '',
  };

  const [selectedFood, setSelectedFood] = useState(null);
  const [manualFood, setManualFood] = useState(emptyFood);
  const [errors, setErrors] = useState({});
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

  function resetState() {
    setSelectedFood(null);
    setManualFood(emptyFood);
    setErrors({});
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
    setManualFood(emptyFood);
    setErrors({});
    setGrams(100);
  }

  function handleGramChange(value) {
    const parsed = Number(value);
    setGrams(Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
  }

  async function submit(isPreset) {
    if (mode === 'manual') {
      const nextErrors = {};

      const name = manualFood.name.trim();
      const caloriesText = manualFood.calories.trim();
      const proteinText = manualFood.protein.trim();
      const carbsText = manualFood.carbs.trim();
      const fatText = manualFood.fat.trim();
      const sugarText = manualFood.sugar.trim();

      if (name.length < 2) {
        nextErrors.name = 'Food name must be at least 2 characters';
      } else if (name.length > 60) {
        nextErrors.name = 'Food name cannot exceed 60 characters';
      }

      if (!caloriesText) {
        nextErrors.calories = 'Calories are required';
      } else if (!/^\d+$/.test(caloriesText)) {
        nextErrors.calories = 'Calories must be a number';
      } else if (caloriesText.length > 4) {
        nextErrors.calories = 'Calories too high';
      }

      function validateOptionalNumber(label, value, maxDigits, maxValue) {
        if (!value) return undefined;
        if (!/^\d+$/.test(value)) return `${label} must be a number`;
        if (value.length > maxDigits) return `${label} too high`;

        const parsed = Number(value);
        if (parsed < 0) return `${label} cannot be negative`;
        if (parsed > maxValue) return `${label} too high`;

        return undefined;
      }

      const proteinError = validateOptionalNumber(
        'Protein',
        proteinText,
        3,
        400
      );
      const carbsError = validateOptionalNumber('Carbs', carbsText, 3, 600);
      const fatError = validateOptionalNumber('Fat', fatText, 3, 300);
      const sugarError = validateOptionalNumber('Sugar', sugarText, 3, 300);

      if (proteinError) nextErrors.protein = proteinError;
      if (carbsError) nextErrors.carbs = carbsError;
      if (fatError) nextErrors.fat = fatError;
      if (sugarError) nextErrors.sugar = sugarError;

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});

      await onCreate({
        name,
        meal,
        calories: Number(caloriesText),
        protein: proteinText ? Number(proteinText) : 0,
        carbs: carbsText ? Number(carbsText) : 0,
        fat: fatText ? Number(fatText) : 0,
        sugar: sugarText ? Number(sugarText) : 0,
        quantity: 1,
        unit: 'serving',
        isPreset,
      });

      handleClose();
      return;
    }

    if (!selectedFood || !scaled) return;

    await onCreate({
      name: selectedFood.name.trim(),
      meal,
      calories: scaled.calories,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fat: scaled.fat,
      sugar: scaled.sugar,
      quantity: grams,
      unit: 'g',
      isPreset,
    });

    handleClose();
  }

  const canSubmit = mode === 'search' ? Boolean(selectedFood && scaled) : true;

  return (
    <SproutModal onClose={handleClose}>
      <div className="sprout-panel w-full max-w-lg p-6 shadow-lg">
        <div className="space-y-5">
          {/* Header */}
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold text-amber-900">
              Log a food item
            </h2>
            <p className="text-sm text-amber-900/60">
              Add food for {meal?.toLowerCase?.() || 'this meal'}
            </p>
          </div>

          {/* Mode Toggle */}
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
          {mode === 'manual' && (
            <ManualFoodForm
              form={manualFood}
              setForm={setManualFood}
              errors={errors}
            />
          )}

          {/* USDA Preview */}
          {mode === 'search' && activeFood && scaled && (
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm">
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
              className="sprout-btn-primary px-4 disabled:opacity-50"
              disabled={!canSubmit}
            >
              Add Food
            </button>

            <button
              type="button"
              onClick={() => submit(true)}
              className="sprout-btn-success px-4 disabled:opacity-50"
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
