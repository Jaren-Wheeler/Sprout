import { Scale } from 'lucide-react';

export default function WeightCard({ stats, onClick }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      className="sprout-card p-5 space-y-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <p className="sprout-subtitle">Current Weight</p>
        <Scale size={18} className="opacity-60" />
      </div>

      <p className="text-3xl font-semibold text-amber-900">
        {stats.currentWeight} lb
      </p>

      <p className="text-xs opacity-60">Click to edit</p>
    </div>
  );
}
