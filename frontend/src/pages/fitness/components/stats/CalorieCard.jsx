export default function CalorieCard({ calorieGoal, caloriesConsumed, onEdit }) {
  const remaining = calorieGoal - caloriesConsumed;

  const percent = Math.min((caloriesConsumed / calorieGoal) * 100, 100);

  return (
    <div
      onClick={onEdit}
      className="sprout-card p-5 cursor-pointer hover:scale-[1.01] transition"
    >
      <h2 className="text-lg font-semibold text-amber-900 mb-3">
        Energy Summary
      </h2>

      <div className="flex justify-between mb-2 text-sm">
        <span>Consumed</span>
        <span className="font-medium">{caloriesConsumed} kcal</span>
      </div>

      <div className="flex justify-between mb-2 text-sm">
        <span>Goal</span>
        <span className="font-medium">{calorieGoal} kcal</span>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <span>Remaining</span>
        <span className="font-medium">{remaining} kcal</span>
      </div>

      {/* Progress Bar */}

      <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-orange-500 h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
