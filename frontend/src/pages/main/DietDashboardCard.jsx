import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

import useDiet from '../fitness/hooks/useDiet';

export default function DietDashboardCard() {
  const { stats, loading } = useDiet();

  if (loading) {
    return (
      <DashboardCard title="Diet" route="/diet">
        Loading...
      </DashboardCard>
    );
  }

  if (!stats) {
    return (
      <DashboardCard title="Diet" route="/diet">
        <DashboardEmptyState message="No diet data yet" />
      </DashboardCard>
    );
  }

  const goal = stats.calorieGoal ?? 0;
  const consumed = stats.caloriesConsumed ?? 0;

  const difference = goal - consumed;
  const isOver = difference < 0;

  const percent = goal > 0 ? (consumed / goal) * 100 : 0;

  return (
    <DashboardCard title="Diet" route="/diet">
      <div className="flex flex-col h-full justify-between">
        {/* TOP CONTENT */}
        <div className="flex flex-col gap-2">
          {/* Calories */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#7a3d11]">
              {Math.round(consumed)}
            </span>
            <span className="text-sm text-[#b06326]">
              / {Math.round(goal)} kcal
            </span>
          </div>

          {/* Status */}
          <div
            className={`text-sm font-medium ${
              isOver ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {isOver
              ? `+${Math.abs(Math.round(difference))} over`
              : `${Math.round(difference)} left`}
          </div>
        </div>

        {/* 🔥 BOTTOM PROGRESS BAR */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(189,152,92,0.22)]">
            <div
              className={`h-full transition-all ${
                isOver
                  ? 'bg-red-500'
                  : 'bg-[linear-gradient(90deg,#5f974a_0%,#84b764_100%)]'
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
