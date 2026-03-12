import { useEffect, useState } from 'react';

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
    onChange({
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein || 0),
      carbs: Number(form.carbs || 0),
      fat: Number(form.fat || 0),
      sugar: Number(form.sugar || 0),
    });
  }, [form]);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-amber-900/70">Food Name</label>

        <input
          className="sprout-input"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Chicken breast"
        />
      </div>

      <div>
        <label className="text-sm text-amber-900/70">Calories</label>

        <input
          className="sprout-input"
          value={form.calories}
          onChange={(e) => update('calories', e.target.value)}
          inputMode="numeric"
          placeholder="200"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-amber-900/70">Protein</label>

          <input
            className="sprout-input"
            value={form.protein}
            onChange={(e) => update('protein', e.target.value)}
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm text-amber-900/70">Carbs</label>

          <input
            className="sprout-input"
            value={form.carbs}
            onChange={(e) => update('carbs', e.target.value)}
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm text-amber-900/70">Fat</label>

          <input
            className="sprout-input"
            value={form.fat}
            onChange={(e) => update('fat', e.target.value)}
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm text-amber-900/70">Sugar</label>

          <input
            className="sprout-input"
            value={form.sugar}
            onChange={(e) => update('sugar', e.target.value)}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}
