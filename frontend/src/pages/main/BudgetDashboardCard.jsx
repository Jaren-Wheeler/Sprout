import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

export default function BudgetDashboardCard() {

  const [budget, setBudget] = useState(null);

  useEffect(() => {
    fetchBudget();
  }, []);

  async function fetchBudget() {
    try {
      const res = await fetch("/api/budget/recent");
      const data = await res.json();
      setBudget(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardCard title="Budget" route="/budget">

      {budget ? (
        <>
          <p><strong>This Month:</strong> ${budget.monthTotal}</p>
          <p><strong>Recent Expense:</strong> {budget.lastExpense}</p>
          <p><strong>Amount:</strong> ${budget.lastAmount}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}

    </DashboardCard>
  );
}