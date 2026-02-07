export default function BudgetCard({ budget }) {
  const percent = (budget.spent / budget.total) * 100;

  return (
    <div className="rounded-lg border border-border p-3 bg-white/5">
      <div className="flex justify-between font-medium">
        <span>{budget.name}</span>
        <span>${(budget.total - budget.spent).toFixed(2)}</span>
      </div>

      <div className="mt-2 h-2 bg-black/20 rounded">
        <div
          className="h-full bg-accent rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-muted mt-1">
        ${budget.spent} spent · ${budget.total} total
      </div>
    </div>
  );
}
