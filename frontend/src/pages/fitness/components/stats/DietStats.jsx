import CalorieCard from './CalorieCard';
import MacroTargetsCard from './MacroTargetsCard';

export default function DietStats({ stats, onEditGoals }) {
  if (!stats) return null;

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
