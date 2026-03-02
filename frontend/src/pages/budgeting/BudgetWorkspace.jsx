import { useState } from 'react';
import { createExpense, createIncomeEntry } from '../../api/finance';

export default function BudgetWorkspace({ categories, expenses, refreshData }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);

    try {
      if (type === 'income') {
        await createIncomeEntry({
          amount: Number(amount),
          note: description,
          incomeDate: new Date().toISOString(),
        });
      } else {
        const selectedCategory = categories.find((c) => c.id === categoryId);

        await createExpense({
          amount: Number(amount),
          description,
          category: selectedCategory?.name || 'Other',
          expenseDate: new Date().toISOString(),
          budgetId: categoryId,
        });
      }

      setDescription('');
      setAmount('');
      setCategoryId('');

      await refreshData();
    } catch (err) {
      alert(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sprout-panel p-4 flex flex-col h-full">
      <h2 className="font-semibold text-lg text-[#3B2F2F] mb-6">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="sprout-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            className="sprout-input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {type === 'expense' && (
            <select
              className="sprout-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-4 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 ${
                type === 'expense'
                  ? 'sprout-btn-base sprout-btn-danger'
                  : 'sprout-btn-muted'
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 ${
                type === 'income'
                  ? 'sprout-btn-base sprout-btn-success'
                  : 'sprout-btn-muted'
              }`}
            >
              Income
            </button>
          </div>

          <button disabled={loading} className="w-full sprout-btn-primary">
            {loading ? 'Adding…' : '+ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
