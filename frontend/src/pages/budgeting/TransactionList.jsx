import { deleteExpense, deleteIncome } from '@/api/finance';
import { Trash2 } from 'lucide-react';

/**
 * TransactionList
 *
 * Displays unified financial history.
 * Supports BOTH income and expenses.
 */

function formatDisplayDate(value) {
  if (!value) return '';

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split('-');
    return `${Number(month)}/${Number(day)}/${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString();
}

async function handleDelete(t, refreshData) {
  try {
    if (t.type === 'income') {
      await deleteIncome(t.id);
    } else {
      await deleteExpense(t.id);
    }

    await refreshData();
  } catch (err) {
    console.error('Failed to delete transaction', err);
  }
}

export default function TransactionList({ transactions = [], refreshData }) {
  // Safety fallback prevents "undefined.length" crashes
  if (!transactions.length) {
    return (
      <div className="sprout-surface p-6 text-[#6B5E5E]">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="sprout-surface p-6 flex flex-col max-h-[600px]">
      <h2 className="text-lg font-semibold text-[#7A3E00] dark:text-white">
        Recent Transactions
      </h2>

      <div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-2">
        {transactions.slice(0, 10).map((t) => {
          const isIncome = t.type === 'income';

          return (
            <div
              key={t.id}
              className={`flex items-center justify-between rounded-2xl border p-4
                ${
                  isIncome
                    ? 'bg-[#EAF6EE] border-[#B9DFC7]'
                    : 'bg-[#F9ECEB] border-[#F0C2BE]'
                }`}
            >
              <div>
                <p className="font-medium text-[#1f1712]">
                  {t.description || t.category}
                </p>

                <p className="text-sm text-[#5a4d47]">
                  {formatDisplayDate(t.date)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`font-semibold text-lg ${
                    isIncome ? 'text-[#148A4B]' : 'text-[#C82E2E]'
                  }`}
                >
                  {isIncome ? '+' : '-'}${Number(t.amount).toFixed(2)}
                </p>

                <button
                  onClick={() => handleDelete(t, refreshData)}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  <Trash2 size={20} className="text-[#7A3E00] " />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
