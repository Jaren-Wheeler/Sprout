import { useEffect, useState } from 'react';
import SproutModal from '../../../components/ui/SproutModal';
import { parseZodErrors } from '../../../utils/validation';
import { fitnessProfileSchema } from '../../../validation/dietSchema';

export default function CreateFitnessProfileModal({
  onClose,
  onDelete,
  onSubmit,
  initialValues,
}) {
  const [form, setForm] = useState({
    currentWeight: '',
    goalWeight: '',
    calorieGoal: '',
    proteinGoal: '',
    carbsGoal: '',
    fatGoal: '',
    age: '',
    heightFt: '',
    heightIn: '',
  });

  const [errors, setErrors] = useState({});

  function preventInvalidNumberInput(e) {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  }

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      currentWeight: initialValues.currentWeight ?? '',
      goalWeight: initialValues.goalWeight ?? '',
      calorieGoal: initialValues.calorieGoal ?? '',
      proteinGoal: initialValues.proteinGoal ?? '',
      carbsGoal: initialValues.carbsGoal ?? '',
      fatGoal: initialValues.fatGoal ?? '',
      age: initialValues.age ?? '',
      heightFt: initialValues.heightFt ?? '',
      heightIn: initialValues.heightIn ?? '',
    });
  }, [initialValues]);

  function handleChange(field, value) {
    const limits = {
      currentWeight: 3,
      goalWeight: 3,
      calorieGoal: 4,
      proteinGoal: 3,
      carbsGoal: 3,
      fatGoal: 3,
      age: 3,
      heightFt: 1,
      heightIn: 2,
    };

    const maxLength = limits[field];

    if (maxLength && value.length > maxLength) return;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      currentWeight: Number(form.currentWeight),
      goalWeight: Number(form.goalWeight),
      calorieGoal: Number(form.calorieGoal),
      proteinGoal: Number(form.proteinGoal),
      carbsGoal: Number(form.carbsGoal),
      fatGoal: Number(form.fatGoal),
      age: Number(form.age),
      heightFt: Number(form.heightFt),
      heightIn: Number(form.heightIn),
    };

    const result = fitnessProfileSchema.safeParse(data);

    if (!result.success) {
      setErrors(parseZodErrors(result.error));
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <SproutModal onClose={onClose}>
      <div className="sprout-panel p-6 w-full max-w-lg space-y-5 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-900">
          Update your fitness profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Current Weight */}
          <div>
            <label className="text-sm text-amber-900/70">
              Current Weight (lbs)
            </label>

            <input
              className="sprout-input"
              type="number"
              min="70"
              max="700"
              onKeyDown={preventInvalidNumberInput}
              value={form.currentWeight}
              onChange={(e) => handleChange('currentWeight', e.target.value)}
            />

            {errors.currentWeight && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentWeight}
              </p>
            )}
          </div>

          {/* Goal Weight */}
          <div>
            <label className="text-sm text-amber-900/70">
              Goal Weight (lbs)
            </label>

            <input
              className="sprout-input"
              type="number"
              onKeyDown={preventInvalidNumberInput}
              value={form.goalWeight}
              onChange={(e) => handleChange('goalWeight', e.target.value)}
            />

            {errors.goalWeight && (
              <p className="text-red-500 text-xs mt-1">{errors.goalWeight}</p>
            )}
          </div>

          {/* Macro Targets */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-amber-900/70">Protein (g)</label>

              <input
                className="sprout-input"
                type="number"
                onKeyDown={preventInvalidNumberInput}
                value={form.proteinGoal}
                onChange={(e) => handleChange('proteinGoal', e.target.value)}
              />

              {errors.proteinGoal && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.proteinGoal}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Carbs (g)</label>

              <input
                className="sprout-input"
                type="number"
                onKeyDown={preventInvalidNumberInput}
                value={form.carbsGoal}
                onChange={(e) => handleChange('carbsGoal', e.target.value)}
              />

              {errors.carbsGoal && (
                <p className="text-red-500 text-xs mt-1">{errors.carbsGoal}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Fat (g)</label>

              <input
                className="sprout-input"
                type="number"
                onKeyDown={preventInvalidNumberInput}
                value={form.fatGoal}
                onChange={(e) => handleChange('fatGoal', e.target.value)}
              />

              {errors.fatGoal && (
                <p className="text-red-500 text-xs mt-1">{errors.fatGoal}</p>
              )}
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="text-sm text-amber-900/70">
              Daily Calorie Goal
            </label>

            <input
              className="sprout-input"
              type="number"
              placeholder="2000 Kcal"
              onKeyDown={preventInvalidNumberInput}
              value={form.calorieGoal}
              onChange={(e) => handleChange('calorieGoal', e.target.value)}
            />

            {errors.calorieGoal && (
              <p className="text-red-500 text-xs mt-1">{errors.calorieGoal}</p>
            )}
          </div>

          {/* Age + Height */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div>
              <label className="text-sm text-amber-900/70">Age</label>

              <input
                className="sprout-input"
                type="number"
                onKeyDown={preventInvalidNumberInput}
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />

              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="text-sm text-amber-900/70">Height</label>

              <div className="flex gap-2 mt-1">
                <input
                  className="sprout-input w-16"
                  type="number"
                  placeholder="ft"
                  onKeyDown={preventInvalidNumberInput}
                  value={form.heightFt}
                  onChange={(e) => handleChange('heightFt', e.target.value)}
                />

                <span className="flex items-center text-sm text-amber-900/70">
                  ft
                </span>

                <input
                  className="sprout-input w-16"
                  type="number"
                  placeholder="in"
                  onKeyDown={preventInvalidNumberInput}
                  value={form.heightIn}
                  onChange={(e) => handleChange('heightIn', e.target.value)}
                />

                <span className="flex items-center text-sm text-amber-900/70">
                  in
                </span>
              </div>

              {(errors.heightFt || errors.heightIn) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.heightFt || errors.heightIn}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-3">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="sprout-btn-danger px-4"
              >
                Delete profile
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="sprout-btn-muted px-4"
              >
                Cancel
              </button>

              <button type="submit" className="sprout-btn-primary px-4">
                Save profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </SproutModal>
  );
}
