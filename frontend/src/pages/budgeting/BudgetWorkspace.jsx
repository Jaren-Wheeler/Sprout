/**
 * Central transaction panel.
 * Allows adding income/expenses.
 */

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
    <div className="bg-white border-2 border-[#E8D9A8] rounded-xl p-6 shadow-sm flex flex-col h-full">
      <h2 className="font-semibold text-lg text-[#3B2F2F] mb-6">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Top Section */}
        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-[#F9F6EC] border border-[#E8D9A8]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-3 rounded-lg bg-[#F9F6EC] border border-[#E8D9A8]"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {type === 'expense' && (
            <select
              className="w-full p-3 rounded-lg bg-[#F9F6EC] border border-[#E8D9A8]"
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

        {/* Bottom Buttons */}
        <div className="mt-auto space-y-4 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Income
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#F4A000] text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? 'Adding…' : '+ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
