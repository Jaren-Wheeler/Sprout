function MacroRow({ label, consumed = 0, goal = 0, color }) {
  const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-amber-900">{label}</span>
        <span className="text-amber-900 font-medium">
          {consumed} / {goal} g
        </span>
      </div>

      <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function MacroTargetsCard({
  proteinGoal,
  carbsGoal,
  fatGoal,
  proteinConsumed,
  carbsConsumed,
  fatConsumed,
  onEdit,
}) {
  return (
    <div
      onClick={onEdit}
      className="sprout-card p-5 cursor-pointer hover:scale-[1.01] transition"
    >
      <h2 className="text-lg font-semibold text-amber-900 mb-4">
        Macro Targets
      </h2>

      <MacroRow
        label="Protein"
        consumed={proteinConsumed}
        goal={proteinGoal}
        color="bg-blue-500"
      />

      <MacroRow
        label="Carbs"
        consumed={carbsConsumed}
        goal={carbsGoal}
        color="bg-yellow-500"
      />

      <MacroRow
        label="Fat"
        consumed={fatConsumed}
        goal={fatGoal}
        color="bg-red-500"
      />
    </div>
  );
}
