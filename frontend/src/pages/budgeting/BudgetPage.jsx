import { useEffect, useState } from "react";
import SetupWizard from "./SetupWizard";
import BudgetDashboard from "./BudgetDashboard";
import AppLayout from "../../components/AppLayout";
import background from "../../assets/bg.png";
import { useTheme } from "../../theme/ThemeContext";

import {
  getBudgets,
  getExpenses,
  getExpectedIncome,
  getIncomeEntries,
} from "../../api/finance";

export default function BudgetPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expectedIncome, setExpectedIncome] = useState(0);
  const [incomeEntries, setIncomeEntries] = useState([]);

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

        const budgetsArray = Array.isArray(budgetsData) ? budgetsData : [];

        setBudgets(budgetsArray);
        setExpenses(expensesData);
        setExpectedIncome(Number(incomeData.amount || 0));
        setIncomeEntries(incomeEntriesData);

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
    setIncomeEntries(incomeEntriesData);
  }

  async function handleSetupComplete() {
    setNeedsSetup(false);
    setLoading(true);
    await refreshData();
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6">Loading finances...</div>;
  }

  return (
    <div
      className="sprout-app-shell"
      style={{
        backgroundImage:
          theme === "dark"
            ? `radial-gradient(circle at 18% 14%, rgba(212, 178, 116, 0.08), transparent 20%), radial-gradient(circle at 82% 78%, rgba(145, 114, 72, 0.06), transparent 18%), repeating-linear-gradient(-18deg, rgba(255,248,228,0.015) 0 2px, rgba(255,248,228,0) 2px 13px), linear-gradient(180deg, #040506 0%, #0a0b0d 52%, #12100d 100%)`
            : `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})`,
        backgroundRepeat: theme === "dark" ? "no-repeat, no-repeat, repeat, no-repeat" : "no-repeat, no-repeat",
        backgroundSize: theme === "dark" ? "auto, auto, 220px 220px, cover" : "auto, cover",
        backgroundPosition: theme === "dark" ? "center, center" : "center, center top",
      }}
    >
      <div className="sprout-page-wrap">
      <AppLayout title="Budget">
        <div>
          {needsSetup ? (
            <SetupWizard onComplete={handleSetupComplete} />
          ) : (
            <BudgetDashboard
              budgets={budgets}
              expenses={expenses}
              incomeEntries={incomeEntries}
              expectedIncome={expectedIncome}
              refreshData={refreshData}
            />
          )}
        </div>
      </AppLayout>
      </div>
    </div>
  );
}
