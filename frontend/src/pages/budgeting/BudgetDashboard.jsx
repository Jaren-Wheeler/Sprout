import { useMemo, useState, useRef, useEffect } from 'react';

import BudgetChart from './BudgetChart';
import BudgetWorkspace from './BudgetWorkspace';

import SummaryCard from './SummaryCard';
import CategoryCard from './CategoryCard';
import TransactionList from './TransactionList';
import CategoryEditorModal from './CategoryEditorModal';
import CategoryAddCard from './CategoryAddCard';

export default function BudgetDashboard({
  budgets,
  expenses,
  incomeEntries,
  expectedIncome,
  refreshData,
}) {
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const totalIncomeEntries = useMemo(() => {
    return incomeEntries.reduce((sum, i) => sum + Number(i.amount), 0);
  }, [incomeEntries]);

  const totalIncome = expectedIncome + totalIncomeEntries;
  const balance = totalIncome - totalExpenses;

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  function handleMouseDown(e) {
    isDown.current = true;
    scrollRef.current.classList.add('cursor-grabbing');
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  }

  function handleMouseLeave() {
    isDown.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  }

  function handleMouseUp() {
    isDown.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  }

  function handleMouseMove(e) {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleWheel(e) {
      const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;
      if (!hasHorizontalOverflow) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.8;
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

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

    return [...expenseTx, ...incomeTx].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [expenses, incomeEntries]);

  const [editingCategory, setEditingCategory] = useState(null);

  return (
    <div className="space-y-6 text-[#3B2F2F]">
      <section className="sprout-page-hero">
        <div className="relative z-10">
          <div>
            <span className="sprout-page-kicker">Financial snapshot</span>
            <h1 className="sprout-page-title">Budget</h1>
            <p className="sprout-page-description">
              Track spending, compare categories, and keep your money view tidy without losing the handmade warmth.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Income" value={totalIncome} color="income" />
        <SummaryCard title="Expenses" value={totalExpenses} color="expense" />
        <SummaryCard title="Balance" value={balance} color="balance" />
      </div>

      <section className="sprout-surface p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(74,51,32,0.48)]">
              Categories
            </p>
            <h2 className="text-xl font-semibold text-[#5a3012]">Your budget spaces</h2>
          </div>
        </div>

        <div className="relative carousel-fade pb-2">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="hide-scrollbar overflow-x-auto scroll-smooth cursor-grab select-none px-1"
          >
            <div className="flex gap-4 snap-x snap-mandatory pb-2">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="snap-start">
                  <CategoryCard category={cat} onClick={setEditingCategory} />
                </div>
              ))}

              <div className="snap-start">
                <CategoryAddCard onClick={() => setEditingCategory('new')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.2fr]">
        <div className="sprout-surface p-5 md:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#5a3012]">Category breakdown</h2>
          </div>
          <BudgetChart categoryStats={categoryStats} />
        </div>

        <div className="sprout-surface p-5 md:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#5a3012]">Manage budgets and expenses</h2>
          </div>
          <BudgetWorkspace
            categories={budgets}
            expenses={expenses}
            refreshData={refreshData}
          />
        </div>
      </section>

      <TransactionList transactions={transactions} />

      {editingCategory && (
        <CategoryEditorModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSaved={refreshData}
        />
      )}
    </div>
  );
}
