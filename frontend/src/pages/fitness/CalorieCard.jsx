import { Flame } from 'lucide-react';
import Progress from '../../components/Progress';

export default function CalorieCard({ goal, consumed }) {
  const percent = goal > 0 ? (consumed / goal) * 100 : 0;

  return (
    <div className="sprout-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="sprout-subtitle">Calories</p>

        <Flame size={18} className="opacity-60" />
      </div>

      <p className="text-2xl font-semibold text-amber-900">
        {consumed} / {goal} kcal
      </p>

      <Progress
        label="Daily Progress"
        percent={percent}
        value={`${consumed} / ${goal} kcal`}
      />
    </div>
  );
}
