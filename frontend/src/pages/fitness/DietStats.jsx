import WeightCard from './WeightCard';
import CalorieCard from './CalorieCard';

export default function DietStats({ stats, dietItems }) {
  if (!stats) return null;

  const today = new Date().toDateString();

  const consumedCalories = (dietItems || [])
    .filter((item) => item.createdAt)
    .filter((item) => new Date(item.createdAt).toDateString() === today)
    .reduce((sum, item) => sum + (item.calories || 0), 0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <WeightCard stats={stats} />

      <CalorieCard goal={stats.calorieGoal} consumed={consumedCalories} />
    </div>
  );
}
