import { useState, useEffect } from "react";
import { getBudgetById } from "../../api/finance";

export default function BudgetDetail({ budgetId }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!budgetId) return;

    async function loadBudget() {
      setLoading(true);
      const data = await getBudgetById(budgetId);
      setBudget(data);
      setLoading(false);
    }
  
    loadBudget();
  }, [budgetId]);

  if (!budgetId) {
    return (
      <div className="border border-border rounded-xl bg-panel p-4 text-muted">
        Select a budget to see details
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border border-border rounded-xl bg-panel p-4">
        Loading budget…
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border rounded-xl bg-panel p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!budget) {
    return null; // ⬅️ CRITICAL: prevents budget.name crash
  }

  return (
    <div className="rounded-xl bg-yellow-200/90 text-black p-6 border border-black/10">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{budget.name}</h2>
        <span className="text-2xl font-bold">${budget.limitAmount-0}</span> {/* Set the zero here to show sum of expenses*/}
      </div>

      <div className="mt-4">
        <div className="h-3 bg-black/20 rounded">
          <div className="h-full bg-black rounded w-[57%]" />
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span>Spent: $256.80</span>
          <span>Total: ${budget.limitAmount}</span>
        </div>
      </div>
    </div>
  );
}
