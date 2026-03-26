import note1 from "../../../../assets/note1.png";

export default function CalorieCard({
  calorieGoal = 0,
  caloriesConsumed = 0,
  currentWeight = null,
  goalWeight = null,
  onEdit,
}) {
  const goal = Number(calorieGoal) || 0;
  const consumed = Number(caloriesConsumed) || 0;

  const difference = goal - consumed;
  const isOver = difference < 0;

  const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  return (
    <div
      onClick={onEdit}
      className="sprout-diet-card-force-light-text w-full cursor-pointer rounded-2xl px-8 pb-14 pt-14 transition hover:scale-[1.01] flex min-h-[260px] flex-col justify-between"
      style={{
        backgroundImage: `url(${note1})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'drop-shadow(4px 8px 14px rgba(87, 60, 26, 0.18))',
      }}
    >
      {/* Header + Stats */}

      <div>
        <h2 className="mb-8 text-center text-lg font-semibold text-amber-900">
          Energy Summary
        </h2>

        {currentWeight != null && goalWeight != null && (
          <div className="flex justify-between items-end mt-3">
            <span className="text-sm text-amber-900/70">Weight</span>

            <span className="text-lg font-semibold text-amber-900">
              {currentWeight} / {goalWeight} lbs
            </span>
          </div>
        )}
        {/* Main Calories Line */}

        <div className="flex justify-between items-end mb-3">
          <span className="text-sm text-amber-900/70">Calories</span>

          <span className="text-lg font-semibold text-amber-900">
            {Math.round(consumed)} / {Math.round(goal)} kcal
          </span>
        </div>

        {/* Remaining / Over */}

        <div className="flex justify-between text-sm">
          <span className="text-amber-900/70">
            {isOver ? 'Over goal' : 'Remaining'}
          </span>

          <span
            className={`font-semibold ${isOver ? 'text-red-500' : 'text-amber-900'}`}
          >
            {Math.abs(Math.round(difference))} kcal
          </span>
        </div>
      </div>

      {/* Progress Bar */}

      <div className="mt-8 px-3">
        <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              isOver ? 'bg-red-500' : 'bg-orange-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {/* Weight */}
    </div>
  );
}
