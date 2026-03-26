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
        <span className="text-[2rem] font-semibold text-[#7a3d11]">
          {stats.caloriesConsumed} kcal
        </span>

        <span className="text-sm text-[#b06326]">/ {stats.calorieGoal}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(189,152,92,0.22)]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#5f974a_0%,#84b764_100%)]" style={{ width: `${percent}%` }} />
      </div>

      <div className="text-xs text-[rgba(113,64,25,0.82)]">{remaining} kcal remaining</div>

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
              <Cell fill="#6b8fc8" />
              <Cell fill="#d59d42" />
              <Cell fill="#6ea55f" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
