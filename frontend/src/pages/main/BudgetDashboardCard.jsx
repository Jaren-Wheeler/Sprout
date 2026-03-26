import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import DashboardEmptyState from "./DashboardEmptyState";
import { getBudgets, getExpenses } from "../../api/finance";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

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
      console.error("Budget dashboard load error:", err);
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

  const remaining = Math.max(budgetTotal - spent, 0);

  const percent =
    budgetTotal > 0 ? (spent / budgetTotal) * 100 : 0;

  const chartData = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: remaining }
  ];

  return (
    <DashboardCard title="Budget" route="/budget">
      <div className="flex items-baseline justify-between">
        <span className="text-[2rem] font-semibold text-[#7a3d11]">
          ${spent.toFixed(2)}
        </span>
        <span className="text-sm text-[#b06326]">
          / ${budgetTotal.toFixed(2)}
        </span>
      </div>

      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={30}
              outerRadius={44}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill="#cb6a4c" />
              <Cell fill="#ead8b7" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(189,152,92,0.22)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#d0782d_0%,#e2a54e_100%)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </DashboardCard>
  );
}
