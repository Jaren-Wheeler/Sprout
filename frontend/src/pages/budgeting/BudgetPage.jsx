import { useEffect, useState } from "react";
import SetupWizard from "./SetupWizard";
import BudgetDashboard from "./BudgetDashboard";

import {
  getBudgets,
  getExpenses,
  getExpectedIncome,
  getIncomeEntries,
} from "../../api/finance";

export default function BudgetPage() {
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expectedIncome, setExpectedIncome] = useState(0);
  const [incomeEntries, setIncomeEntries] = useState([]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    async function loadData() {
      try {
        const [
          budgetsData,
          expensesData,
          incomeData,
          incomeEntriesData,
        ] = await Promise.all([
          getBudgets(),
          getExpenses(),
          getExpectedIncome(),
          getIncomeEntries(),
        ]);

        const budgetsArray = Array.isArray(budgetsData)
          ? budgetsData
          : [];

        setBudgets(budgetsArray);
        setExpenses(expensesData);
        setExpectedIncome(Number(incomeData.amount || 0));
        setIncomeEntries(incomeEntriesData); // ⭐ CRITICAL FIX

        if (budgetsArray.length === 0) {
          setNeedsSetup(true);
        }
      } catch (err) {
        console.error("Failed to load budgeting data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =====================================================
  // REFRESH HELPER
  // =====================================================
  async function refreshData() {
    const [
      budgetsData,
      expensesData,
      incomeData,
      incomeEntriesData,
    ] = await Promise.all([
      getBudgets(),
      getExpenses(),
      getExpectedIncome(),
      getIncomeEntries(),
    ]);

    setBudgets(budgetsData);
    setExpenses(expensesData);
    setExpectedIncome(Number(incomeData.amount || 0));
    setIncomeEntries(incomeEntriesData); // ⭐ FIXED
  }

  // =====================================================
  // SETUP COMPLETION HANDLER
  // =====================================================
  async function handleSetupComplete() {
    setNeedsSetup(false);
    setLoading(true);
    await refreshData();
    setLoading(false);
  }

  // =====================================================
  // RENDER STATES
  // =====================================================
  if (loading) {
    return <div className="p-6">Loading finances…</div>;
  }

  if (needsSetup) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <BudgetDashboard
      budgets={budgets}
      expenses={expenses}
      incomeEntries={incomeEntries}
      expectedIncome={expectedIncome}
      refreshData={refreshData}
    />
  );
}
