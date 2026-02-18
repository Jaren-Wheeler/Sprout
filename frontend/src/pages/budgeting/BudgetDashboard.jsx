import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import BudgetChart from './BudgetChart';
import BudgetWorkspace from './BudgetWorkspace';
import Sprout from '../../components/chatbot/Sprout';

import SummaryCard from './SummaryCard';
import CategoryCard from './CategoryCard';
import TransactionList from './TransactionList';
import CategoryEditorModal from './CategoryEditorModal';
import CategoryAddCard from './CategoryAddCard';

import sproutLogo from '../../assets/Logo.png';
import { sendChatMessage } from '../../api/chatbot';

export default function BudgetDashboard({
  budgets,
  expenses,
  incomeEntries,
  expectedIncome,
  refreshData,
}) {
  // =====================================================
  // DERIVED TOTALS
  // =====================================================

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const totalIncomeEntries = useMemo(() => {
    return incomeEntries.reduce((sum, i) => sum + Number(i.amount), 0);
  }, [incomeEntries]);

  const totalIncome = expectedIncome + totalIncomeEntries;
  const balance = totalIncome - totalExpenses;

  // =====================================================
  // CATEGORY SPENDING DATA
  // =====================================================
  // Used for progress bars.

  const categoryStats = useMemo(() => {
    return budgets.map((b) => {
      const spent = expenses
        .filter((e) => e.budgetId === b.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        ...b,
        spent,
        remaining: Number(b.limitAmount) - spent,
      };
    });
  }, [budgets, expenses]);

  // =====================================================
  // MERGE TRANSACTIONS
  // =====================================================

  const transactions = useMemo(() => {
    const expenseTx = expenses.map((e) => ({
      id: e.id,
      amount: Number(e.amount),
      description: e.description,
      date: e.expenseDate,
      type: 'expense',
      category: e.category,
    }));

    const incomeTx = incomeEntries.map((i) => ({
      id: i.id,
      amount: Number(i.amount),
      description: i.note,
      date: i.incomeDate,
      type: 'income',
      category: 'Income',
    }));

    // Merge + sort newest first
    return [...expenseTx, ...incomeTx].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [expenses, incomeEntries]);

  const [editingCategory, setEditingCategory] = useState(null);
  

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F3EED9] text-[#3B2F2F]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link to="/dashboard">
              <img src={sproutLogo} className="h-20" />
            </Link>
            Budget
          </h1>

          <p className="text-[#6B5E5E]">
            Track your spending and watch your savings grow
          </p>
        </header>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Planned monthly income */}
          <SummaryCard title="Income" value={totalIncome} color="income" />

          {/* Real spending */}
          <SummaryCard title="Expenses" value={totalExpenses} color="expense" />

          {/* Budget planning balance */}
          <SummaryCard title="Balance" value={balance} color="balance" />
        </div>

        {/* ================= CATEGORY PROGRESS STRIP ================= */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 px-2 snap-x snap-mandatory">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="snap-start">
                <CategoryCard category={cat} onClick={setEditingCategory} />
              </div>
            ))}

            {/* ALWAYS LAST */}
            <div className="snap-start">
              <CategoryAddCard onClick={() => setEditingCategory('new')} />
            </div>
          </div>
        </div>

        {/* ================= MAIN WORKSPACE ================= */}
        <div className="grid lg:grid-cols-2 gap-6">
          <BudgetChart expenses={expenses} />

          <BudgetWorkspace
            categories={budgets}
            expenses={expenses}
            refreshData={refreshData}
          />
        </div>

        {/* ================= TRANSACTION HISTORY ================= */}
        <TransactionList transactions={transactions} />

        {/* ================= AI ASSISTANT ================= */}
        <Sprout onSend={sendChatMessage} onBudgetChange={refreshData} />

        {editingCategory && (
          <CategoryEditorModal
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSaved={refreshData}
          />
        )}
      </div>
    </div>
  );
}
