import { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { getDietItems, getDiets, getFitnessInfo } from '../../api/health';

export default function DietDashboardCard() {
  const [stats, setStats] = useState(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    loadDietStats();
  }, []);

  async function loadDietStats() {
    try {
      const fitness = await getFitnessInfo();
      const diets = await getDiets();

      if (!diets || diets.length === 0) {
        setEmpty(true);
        return;
      }

      const activeDiet = diets[0];
      const items = await getDietItems(activeDiet.id);

      if (!items || items.length === 0) {
        setStats({
          calorieGoal: fitness?.calorieGoal ?? 0,
          caloriesConsumed: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
        });
        setEmpty(true);
        return;
      }

      let calories = 0;
      let carbs = 0;
      let fat = 0;
      let protein = 0;

      items.forEach((item) => {
        calories += Number(item.calories || 0);
        carbs += Number(item.carbs || 0);
        fat += Number(item.fat || 0);
        protein += Number(item.protein || 0);
      });

      setStats({
        calorieGoal: fitness?.calorieGoal ?? 0,
        caloriesConsumed: calories,
        carbs,
        fat,
        protein,
      });
    } catch (err) {
      console.error('Diet dashboard error:', err);
      setEmpty(true);
    }
  }

  if (empty && !stats) {
    return (
      <DashboardCard title="Diet" route="/diet">
        <DashboardEmptyState message="No foods logged today" />
      </DashboardCard>
    );
  }

  if (!stats) {
    return (
      <DashboardCard title="Diet" route="/diet">
        Loading...
      </DashboardCard>
    );
  }

  const percent =
    stats.calorieGoal > 0
      ? Math.min((stats.caloriesConsumed / stats.calorieGoal) * 100, 100)
      : 0;

  const remaining = Math.max(
    (stats.calorieGoal ?? 0) - (stats.caloriesConsumed ?? 0),
    0
  );

  const macroData = [
    { name: 'Carbs', value: stats.carbs },
    { name: 'Fat', value: stats.fat },
    { name: 'Protein', value: stats.protein },
  ];

  return (
    <DashboardCard title="Diet" route="/diet">
      <div className="flex justify-between items-baseline">
        <span className="text-2xl font-semibold text-amber-900">
          {stats.caloriesConsumed} kcal
        </span>

        <span className="text-sm text-amber-700">/ {stats.calorieGoal}</span>
      </div>

      <div className="w-full h-2 bg-[#E8D9A8] rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
      </div>

      <div className="text-xs text-amber-800">{remaining} kcal remaining</div>

      <div className="w-full h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={macroData}
              innerRadius={24}
              outerRadius={36}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill="#3B82F6" />
              <Cell fill="#F59E0B" />
              <Cell fill="#22C55E" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
