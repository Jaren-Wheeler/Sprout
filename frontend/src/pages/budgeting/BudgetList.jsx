/**
 * BudgetList
 *
 * Sidebar list of all budgets.
 * Handles selection and provides an entry point for creating new budgets.
 */

import BudgetCard from './BudgetCard';

export default function BudgetList({
  budgets,
  selectedBudgetId,
  onSelectBudget,
  onCreateBudget,
}) {
  return (
    <div className="border border-border rounded-xl bg-panel p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-semibold leading-none">All Budgets</h2>

        <button
          onClick={onCreateBudget}
          className="w-7 h-7 flex items-center justify-center
                     rounded-full bg-accent text-black font-bold
                     hover:opacity-80"
          title="Create budget"
        >
          +
        </button>
      </div>

      {/* Budget list */}
      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {budgets.map((b) => (
          <BudgetCard
            key={b.id}
            budget={b}
            isActive={b.id === selectedBudgetId}
            onClick={() => onSelectBudget(b.id)}
          />
        ))}
      </div>
    </div>
  );
}
