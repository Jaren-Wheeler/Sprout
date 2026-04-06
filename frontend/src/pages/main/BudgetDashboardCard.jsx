import { useEffect, useState } from 'react';
import { getBudgets, getExpenses } from '../../api/finance';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

export default function BudgetDashboardCard() {
  const [spent, setSpent] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const budgets = await getBudgets();
      const expenses = await getExpenses();

      const totalBudget = budgets.reduce(
        (sum, b) => sum + Number(b.limitAmount || 0),
        0
      );

      const totalSpent = expenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );

      setBudgetTotal(totalBudget);
      setSpent(totalSpent);
    } catch (err) {
      console.error('Budget dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardCard title="Budget" route="/budget">
        Loading...
      </DashboardCard>
    );
  }

  if (budgetTotal === 0 && spent === 0) {
    return (
      <DashboardCard title="Budget" route="/budget">
        <DashboardEmptyState message="No budgets created yet" />
      </DashboardCard>
    );
  }

  const remaining = budgetTotal - spent;
  const isOver = remaining < 0;

  const percent = budgetTotal > 0 ? (spent / budgetTotal) * 100 : 0;

  return (
    <DashboardCard title="Budget" route="/budget">
      <div className="flex flex-col h-full justify-between">
        {/* TOP */}
        <div className="flex flex-col gap-2">
          {/* Amount */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#7a3d11]">
              ${spent.toFixed(0)}
            </span>
            <span className="text-sm text-[#b06326]">
              / ${budgetTotal.toFixed(0)}
            </span>
          </div>

          {/* Status */}
          <div
            className={`text-sm font-medium ${
              isOver ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {isOver
              ? `$${Math.abs(remaining).toFixed(0)} over`
              : `$${remaining.toFixed(0)} left`}
          </div>
        </div>

        {/* BOTTOM PROGRESS */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(189,152,92,0.22)]">
            <div
              className={`h-full transition-all ${
                isOver
                  ? 'bg-red-500'
                  : 'bg-[linear-gradient(90deg,#d0782d_0%,#e2a54e_100%)]'
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
