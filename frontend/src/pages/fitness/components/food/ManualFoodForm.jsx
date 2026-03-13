import { useEffect, useState } from 'react';

function toNumber(value) {
  if (value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ManualFoodForm({ onChange }) {
  const [form, setForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    sugar: '',
  });

  useEffect(() => {
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      onChange(null);
      return;
    }

    onChange({
      name: trimmedName,
      calories: toNumber(form.calories),
      protein: toNumber(form.protein),
      carbs: toNumber(form.carbs),
      fat: toNumber(form.fat),
      sugar: toNumber(form.sugar),
    });
  }, [form, onChange]);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-white/60 p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900/80">
          Food Name
        </label>
        <input
          className="sprout-input"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Chicken breast"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900/80">
          Calories
        </label>
        <input
          className="sprout-input"
          value={form.calories}
          onChange={(e) => update('calories', e.target.value)}
          inputMode="decimal"
          placeholder="200"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900/80">
            Protein
          </label>
          <input
            className="sprout-input"
            value={form.protein}
            onChange={(e) => update('protein', e.target.value)}
            inputMode="decimal"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900/80">
            Carbs
          </label>
          <input
            className="sprout-input"
            value={form.carbs}
            onChange={(e) => update('carbs', e.target.value)}
            inputMode="decimal"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900/80">
            Fat
          </label>
          <input
            className="sprout-input"
            value={form.fat}
            onChange={(e) => update('fat', e.target.value)}
            inputMode="decimal"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900/80">
            Sugar
          </label>
          <input
            className="sprout-input"
            value={form.sugar}
            onChange={(e) => update('sugar', e.target.value)}
            inputMode="decimal"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
