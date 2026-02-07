import { useState, useEffect } from "react";
import { getBudgetById } from "../../api/finance";


export default function BudgetSummary({budgetId}) {
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
    return null;
  }
  return (
    <div className="rounded-xl bg-purple-200/90 text-black p-6 border border-black/10">
      <h2 className="font-semibold mb-4">Overall Spending</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryItem label="Total Budget" value={`$${budget.limitAmount}`} /> 
        <SummaryItem label="Total Spent" value={`$${0}`} /> {/* Set the zero here to show sum of expenses*/}
        <SummaryItem label="Remaining" value={`$${budget.limitAmount - 0}`} highlight /> {/* Set the zero here to show sum of expenses*/}
      </div>
    </div>
  );
}

function SummaryItem({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-white/80 p-4">
      <div className="text-sm">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-green-700' : ''}`}>
        {value}
      </div>
    </div>
  );
}
