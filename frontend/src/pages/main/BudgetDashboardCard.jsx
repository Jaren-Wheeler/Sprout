import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

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
    }
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

      {/* totals */}
      <div className="flex items-baseline justify-between">

        <span className="text-2xl font-semibold text-amber-900">
          ${spent.toFixed(2)}
        </span>

        <span className="text-sm text-amber-700">
          / ${budgetTotal.toFixed(2)}
        </span>

      </div>

      {/* mini donut chart */}
      <div className="w-full h-28">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              innerRadius={30}
              outerRadius={44}
              paddingAngle={2}
              dataKey="value"
            >

              <Cell fill="#E25555" />
              <Cell fill="#E8D9A8" />

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* progress bar */}
      <div className="w-full h-2 bg-[#E8D9A8] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#F4A000]"
          style={{ width: `${percent}%` }}
        />

      </div>

    </DashboardCard>
  );
}