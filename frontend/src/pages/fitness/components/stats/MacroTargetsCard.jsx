import note1 from "../../../../assets/note1.png";

function MacroRow({ label, consumed = 0, goal = 0, color }) {
  const value = Number(consumed) || 0;
  const target = Number(goal) || 0;

  const percent = target > 0 ? (value / target) * 100 : 0;
  const progressWidth = Math.min(percent, 100);

  const remaining = target - value;
  const isOver = value > target;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm text-amber-900/80">{label}</span>

        <span className="font-semibold text-amber-900">
          {Math.round(value)} / {Math.round(target)} g
        </span>
      </div>

      {/* Remaining / Over feedback */}

      <div className="flex justify-between text-xs mb-2">
        <span className="text-amber-900/60">
          {isOver ? 'Over goal' : 'Remaining'}
        </span>

        <span
          className={`font-semibold ${isOver ? 'text-red-500' : 'text-amber-900'}`}
        >
          {Math.abs(Math.round(remaining))} g
        </span>
      </div>

      {/* Progress Bar */}

      <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : color
          }`}
          style={{ width: `${progressWidth}%` }}
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
      className="sprout-diet-card-force-light-text w-full cursor-pointer rounded-2xl px-8 pb-14 pt-14 transition hover:scale-[1.01] flex min-h-[260px] flex-col"
      style={{
        backgroundImage: `url(${note1})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'drop-shadow(4px 8px 14px rgba(87, 60, 26, 0.18))',
      }}
    >
      <h2 className="mb-8 text-center text-lg font-semibold text-amber-900">
        Macro Targets
      </h2>

      <div className="px-3">
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
          color="bg-green-500"
        />

        <MacroRow
          label="Fat"
          consumed={fatConsumed}
          goal={fatGoal}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}
