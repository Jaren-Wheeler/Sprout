export default function BudgetCard({ budget, onClick, isActive }) {
  const limit = Number(budget.limitAmount) || 0;
  const spent = Number(budget.spent || 0);
  const percent = limit > 0 ? (spent / limit) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3 cursor-pointer transition
        ${
          isActive
            ? 'border-accent bg-accent/10'
            : 'border-border bg-white/5 hover:bg-white/10'
        }
      `}
    >
      <div className="flex justify-between font-medium text-white">
        <span>{budget.name}</span>
        <span>${limit.toFixed(2)}</span>
      </div>

      <div className="mt-2 h-2 bg-black/20 rounded">
        <div
          className="h-full bg-accent rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-muted mt-1">
        ${spent.toFixed(2)} spent · ${limit.toFixed(2)} total
      </div>
    </div>
  );
}
