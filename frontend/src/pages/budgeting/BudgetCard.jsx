
export default function BudgetCard({ budget, onClick }) {
  const percent = (budget.spent / budget.limitAmount) * 100;

  return (
    <div className="rounded-lg border border-border p-3 bg-white/5 hover:bg-gray-500"
      onClick={onClick}
    >
      <div className="flex justify-between font-medium">
        <span>{budget.name}</span>
        <span>${(budget.limitAmount - 0).toFixed(2)}</span> {/* Set the zero here to show sum of expenses*/}
      </div>

      <div className="mt-2 h-2 bg-black/20 rounded">
        <div
          className="h-full bg-accent rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-muted mt-1">
        $0 spent · ${budget.limitAmount} total {/* Set the zero here to show sum of expenses*/}
      </div>
    </div>
  );
}
