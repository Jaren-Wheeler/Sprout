function MacroRow({ label, consumed = 0, goal = 0, color }) {
  const value = Number(consumed) || 0;
  const target = Number(goal) || 0;

  const percent = target > 0 ? Math.min((value / target) * 100, 100) : 0;

  const isOver = value > target;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-1">
        <span className="text-amber-900/80 text-sm">{label}</span>

        <span className="text-amber-900 font-semibold">
          {Math.round(value)} / {Math.round(target)} g
        </span>
      </div>

      <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : color
          }`}
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
      className="sprout-card p-6 cursor-pointer hover:scale-[1.01] transition flex flex-col"
    >
      <h2 className="text-lg font-semibold text-amber-900 mb-5">
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
        color="bg-orange-500"
      />
    </div>
  );
}
