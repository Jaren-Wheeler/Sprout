/**
 * CreateExpenseModal
 *
 * Modal for adding a new expense to a specific budget.
 * Emits normalized expense data back to the parent.
 */

import { useState } from 'react';

export default function CreateExpenseModal({ budgetId, onCreate, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  async function handleSubmit(e) {
    e.preventDefault();

    onCreate({
      amount: Number(amount),
      category,
      description,
      expenseDate,
      budgetId,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-xl bg-panel p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Category"
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-black/30"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-accent text-black font-medium"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
