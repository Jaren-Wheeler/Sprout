/**
 * CreateBudgetModal
 *
 * Simple modal for creating a new budget.
 * Collects name and monthly limit, then delegates creation upward.
 */

import { useState } from 'react';

export default function CreateBudgetModal({ onCreate, onClose }) {
  const [name, setName] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    onCreate({
      name,
      limitAmount: Number(limitAmount),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* Modal container */}
      <div className="bg-panel rounded-xl p-6 w-full max-w-sm border border-border">
        <h2 className="text-lg font-semibold mb-4">Create Budget</h2>

        {/* Budget creation form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-bg border border-border"
            placeholder="Budget name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Budget limit input */}
          <input
            type="number"
            className="w-full p-2 rounded bg-bg border border-border"
            placeholder="Limit"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-2 text-muted"
              onClick={onClose}
            >
              Cancel
            </button>

            {/* creation flow */}
            <button
              type="submit"
              className="px-3 py-2 rounded bg-accent text-black font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
