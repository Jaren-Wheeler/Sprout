/**
 * ExpenseList
 *
 * Displays expenses for the active budget.
 * Handles empty state and delete actions.
 */

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-muted text-sm">
        No expenses yet. Add your first one.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between
                     rounded-lg bg-black/30 border border-white/10
                     px-4 py-3"
        >
          <div>
            <div className="font-medium text-white">
              {expense.description || expense.category}
            </div>
            <div className="text-xs text-muted">
              {expense.category} ·{' '}
              {new Date(expense.expenseDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-semibold text-white">
              ${Number(expense.amount).toFixed(2)}
            </div>

            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-400 hover:text-red-300 text-sm"
              title="Delete expense"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
