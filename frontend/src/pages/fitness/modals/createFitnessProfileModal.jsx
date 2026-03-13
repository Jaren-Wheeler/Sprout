import { useEffect, useState } from 'react';
import SproutModal from '../../../components/ui/SproutModal';

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
  });

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
    });
  }, [initialValues]);

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      currentWeight: Number(form.currentWeight),
      goalWeight: Number(form.goalWeight),
      calorieGoal: Number(form.calorieGoal),
      proteinGoal: Number(form.proteinGoal),
      carbsGoal: Number(form.carbsGoal),
      fatGoal: Number(form.fatGoal),
      age: Number(form.age),
      heightFt: Number(form.heightFt),
    });
  }

  return (
    <SproutModal onClose={onClose}>
      <div className="sprout-panel p-6 w-full max-w-lg space-y-5 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-900">
          Update your fitness profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-amber-900/70">
              Current Weight (lbs)
            </label>
            <input
              className="sprout-input"
              type="number"
              value={form.currentWeight}
              onChange={(e) => handleChange('currentWeight', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-amber-900/70">
              Goal Weight (lbs)
            </label>
            <input
              className="sprout-input"
              type="number"
              value={form.goalWeight}
              onChange={(e) => handleChange('goalWeight', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-amber-900/70">Protein (g)</label>
              <input
                className="sprout-input"
                type="number"
                value={form.proteinGoal}
                onChange={(e) => handleChange('proteinGoal', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Carbs (g)</label>
              <input
                className="sprout-input"
                type="number"
                value={form.carbsGoal}
                onChange={(e) => handleChange('carbsGoal', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Fat (g)</label>
              <input
                className="sprout-input"
                type="number"
                value={form.fatGoal}
                onChange={(e) => handleChange('fatGoal', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-amber-900/70">
              Daily Calorie Goal
            </label>
            <input
              className="sprout-input"
              type="number"
              value={form.calorieGoal}
              onChange={(e) => handleChange('calorieGoal', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-amber-900/70">Age</label>
              <input
                className="sprout-input"
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Height (ft)</label>
              <input
                className="sprout-input"
                type="number"
                value={form.heightFt}
                onChange={(e) => handleChange('heightFt', e.target.value)}
              />
            </div>
          </div>

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
