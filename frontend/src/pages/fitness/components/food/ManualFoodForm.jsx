export default function ManualFoodForm({ form, setForm, errors }) {
  function preventInvalidNumberInput(e) {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  }

  const limits = {
    calories: 4,
    protein: 3,
    carbs: 3,
    fat: 3,
    sugar: 3,
  };

  function handleChange(field, value) {
    const maxLength = limits[field];

    if (maxLength && value.length > maxLength) return;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-white/60 p-4 shadow-sm">
      {/* Food Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900/80">
          Food Name
        </label>

        <input
          className="sprout-input"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Chicken breast"
        />

        {errors?.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Calories */}
      <div>
        <label className="mb-1 block text-sm font-medium text-amber-900/80">
          Calories
        </label>

        <input
          className="sprout-input"
          type="number"
          inputMode="decimal"
          onKeyDown={preventInvalidNumberInput}
          value={form.calories}
          onChange={(e) => handleChange('calories', e.target.value)}
          placeholder="200"
        />

        {errors?.calories && (
          <p className="text-xs text-red-500 mt-1">{errors.calories}</p>
        )}
      </div>

      {/* Macros */}
      <div className="grid grid-cols-2 gap-3">
        {['protein', 'carbs', 'fat', 'sugar'].map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium text-amber-900/80 capitalize">
              {field}
            </label>

            <input
              className="sprout-input"
              type="number"
              inputMode="decimal"
              onKeyDown={preventInvalidNumberInput}
              value={form[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder="0"
            />

            {errors?.[field] && (
              <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
