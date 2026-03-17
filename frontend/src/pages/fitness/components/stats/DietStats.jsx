import CalorieCard from './CalorieCard';
import MacroTargetsCard from './MacroTargetsCard';

export default function DietStats({ stats, onEditGoals }) {
  if (!stats) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div
          onClick={onEditGoals}
          className="sprout-card p-6 cursor-pointer text-center hover:scale-[1.01] transition"
        >
          <h2 className="text-lg font-semibold text-amber-900 mb-2">
            Energy Summary
          </h2>

          <p className="text-sm text-amber-900/70">
            Click to create your diet goals!
          </p>
        </div>

        <div
          onClick={onEditGoals}
          className="sprout-card p-6 cursor-pointer text-center hover:scale-[1.01] transition"
        >
          <h2 className="text-lg font-semibold text-amber-900 mb-2">
            Macro Targets
          </h2>

          <p className="text-sm text-amber-900/70">
            Click to add your diet goals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <CalorieCard
        calorieGoal={stats.calorieGoal}
        caloriesConsumed={stats.caloriesConsumed}
        currentWeight={stats.currentWeight}
        goalWeight={stats.goalWeight}
        onEdit={onEditGoals}
      />

      <MacroTargetsCard
        proteinGoal={stats.proteinGoal}
        carbsGoal={stats.carbsGoal}
        fatGoal={stats.fatGoal}
        proteinConsumed={stats.proteinConsumed}
        carbsConsumed={stats.carbsConsumed}
        fatConsumed={stats.fatConsumed}
        onEdit={onEditGoals}
      />
    </div>
  );
}
