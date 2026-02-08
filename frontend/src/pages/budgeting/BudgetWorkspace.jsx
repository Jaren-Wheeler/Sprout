/**
 * BudgetWorkspace
 *
 * Main detail view for the selected budget.
 * Shows totals, remaining amount, progress,
 * and the list of expenses tied to this budget.
 */

import { useState } from 'react';
import ExpenseList from './ExpenseList';
import CreateExpenseModal from './CreateExpenseModal';

export default function BudgetWorkspace({
  budget,
  expenses,
  onDeleteExpense,
  onCreateExpense,
  onDeleteBudget,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (!budget) {
    return (
      <div className="border border-border rounded-xl bg-panel p-6 text-muted">
        Select a budget to see details
      </div>
    );
  }

  const spent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = Number(budget.limitAmount) - spent;
  const percent = Math.min((spent / budget.limitAmount) * 100, 100);

  return (
    <>
      {/* Workspace card */}
      <div className="rounded-2xl bg-panel p-6 border border-border space-y-6">
        {/* Header + summary */}
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">{budget.name}</h2>
              <p className="text-sm text-muted">
                ${spent.toFixed(2)} spent of $
                {Number(budget.limitAmount).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => onDeleteBudget(budget.id)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Delete
            </button>

            <div className="text-right">
              <div className="text-sm text-muted">Remaining</div>
              <div className="text-2xl font-bold text-green-500">
                ${remaining.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="h-3 bg-black/40 rounded">
              <div
                className="h-full bg-accent rounded transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryItem
              label="Total Budget"
              value={`$${budget.limitAmount}`}
            />
            <SummaryItem label="Total Spent" value={`$${spent.toFixed(2)}`} />
            <SummaryItem
              label="Remaining"
              value={`$${remaining.toFixed(2)}`}
              highlight
            />
          </div>

          {/* Add expense */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-lg bg-accent text-black font-medium"
          >
            + Add Expense
          </button>
        </div>

        {/* Scrollable expense list */}
        <div className="border-t border-border px-6 py-4 overflow-y-auto min-h-0">
          <ExpenseList expenses={expenses} onDelete={onDeleteExpense} />
        </div>
      </div>

      {isAddOpen && (
        <CreateExpenseModal
          budgetId={budget.id}
          onCreate={(data) => {
            onCreateExpense(data);
            setIsAddOpen(false);
          }}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </>
  );
}

function SummaryItem({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-black/20 border border-white/10 p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div
        className={`text-2xl font-semibold ${
          highlight ? 'text-green-400' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
