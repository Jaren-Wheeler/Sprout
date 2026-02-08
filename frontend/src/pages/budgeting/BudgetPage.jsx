/**
 * BudgetPage
 *
 * Top-level budgeting view.
 * Owns budget selection, loading state, and data fetching,
 * and wires the sidebar, workspace, and chart together.
 */

import { useEffect, useState } from 'react';
import BudgetList from '../budgeting/BudgetList';
import BudgetChart from '../budgeting/BudgetChart';
import BudgetWorkspace from './BudgetWorkspace';
import CreateBudgetModal from '../budgeting/CreateBudgetModal';
import Sprout from '../../components/chatbot/Sprout';

import sproutLogo from '../../assets/Logo.png';
import dark from '../../assets/bg-dark.png';

import { sendChatMessage } from '../../api/chatbot';
import {
  getBudgets,
  createBudget,
  getBudgetById,
  getExpenses,
  createExpense,
  deleteExpense,
  deleteBudget,
} from '../../api/finance';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [activeBudget, setActiveBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // --------------------------------------
  // Initial load
  // --------------------------------------
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [budgetsData, expensesData] = await Promise.all([
          getBudgets(),
          getExpenses(),
        ]);

        setBudgets(budgetsData);
        setExpenses(expensesData);

        if (budgetsData.length > 0) {
          setSelectedBudgetId(budgetsData[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load budgets');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // --------------------------------------
  // Load active budget
  // --------------------------------------
  useEffect(() => {
    if (!selectedBudgetId) return;

    async function loadActiveBudget() {
      try {
        const budget = await getBudgetById(selectedBudgetId);
        setActiveBudget(budget);
      } catch (err) {
        console.error(err);
      }
    }

    loadActiveBudget();
  }, [selectedBudgetId]);

  // --------------------------------------
  // Derived data
  // --------------------------------------
  const spentByBudget = expenses.reduce((acc, e) => {
    acc[e.budgetId] = (acc[e.budgetId] || 0) + Number(e.amount);
    return acc;
  }, {});

  const enrichedBudgets = budgets.map((b) => ({
    ...b,
    spent: spentByBudget[b.id] || 0,
  }));

  const activeExpenses = expenses.filter(
    (e) => e.budgetId === selectedBudgetId
  );

  // --------------------------------------
  // Actions
  // --------------------------------------
  async function handleCreateBudget(data) {
    try {
      const newBudget = await createBudget(data);
      setBudgets((prev) => [...prev, newBudget]);
      setSelectedBudgetId(newBudget.id);
      setIsCreateOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create budget');
    }
  }

  async function handleCreateExpense(data) {
    try {
      const newExpense = await createExpense(data);
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    }
  }

  async function handleDeleteExpense(expenseId) {
    try {
      await deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  }

  async function handleDeleteBudget(budgetId) {
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return;

    const confirmed = window.confirm(
      `Delete "${budget.name}" and all of its expenses?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteBudget(budgetId);

      setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
      setExpenses((prev) => prev.filter((e) => e.budgetId !== budgetId));

      setSelectedBudgetId((prevSelected) => {
        if (prevSelected !== budgetId) return prevSelected;
        const remaining = budgets.filter((b) => b.id !== budgetId);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    } catch (err) {
      alert(err.message || 'Failed to delete budget');
    }
  }

  // --------------------------------------
  // Render states
  // --------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text p-6">Loading budgets…</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${dark})` }}
    >
      {/* Content container */}
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <img src={sproutLogo} alt="Sprout logo" className="h-10 w-auto" />
            Budget
          </h1>

          <p className="text-muted">
            Track your spending and watch your savings grow
          </p>
        </header>

        {budgets.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="max-w-md text-center rounded-xl bg-panel p-8 border border-border">
              <h2 className="text-xl font-semibold mb-2">
                Welcome to Sprout Budgeting
              </h2>
              <p className="text-muted mb-6">
                Create your first budget to start tracking your spending.
              </p>

              <button
                className="px-4 py-2 rounded-lg bg-accent text-black font-medium"
                onClick={() => setIsCreateOpen(true)}
              >
                Create your first budget
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start min-h-0">
            <BudgetList
              budgets={enrichedBudgets}
              selectedBudgetId={selectedBudgetId}
              onSelectBudget={setSelectedBudgetId}
              onCreateBudget={() => setIsCreateOpen(true)}
            />

            <div className="space-y-6">
              <BudgetWorkspace
                budget={activeBudget}
                expenses={activeExpenses}
                onDeleteExpense={handleDeleteExpense}
                onCreateExpense={handleCreateExpense}
                onDeleteBudget={handleDeleteBudget}
              />

              <BudgetChart budget={activeBudget} expenses={activeExpenses} />
            </div>
          </div>
        )}

        {isCreateOpen && (
          <CreateBudgetModal
            onCreate={handleCreateBudget}
            onClose={() => setIsCreateOpen(false)}
          />
        )}

        <Sprout onSend={sendChatMessage} />
      </div>
    </div>
  );
}
