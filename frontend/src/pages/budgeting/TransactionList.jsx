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

export default function TransactionList({ transactions = [] }) {
  // Safety fallback prevents "undefined.length" crashes
  if (!transactions.length) {
    return (
      <div className="sprout-surface p-6 text-[#6B5E5E]">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="sprout-surface space-y-4 p-6">
      <h2 className="text-lg font-semibold text-[#7A3E00]">
        Recent Transactions
      </h2>

      <div className="space-y-3">
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
                <p className="font-medium text-[#3B2F2F]">
                  {t.description || t.category}
                </p>

                <p className="text-sm text-[#6B5E5E]">
                  {formatDisplayDate(t.date)}
                </p>
              </div>

              <p
                className={`font-semibold text-lg ${
                  isIncome ? 'text-[#148A4B]' : 'text-[#C82E2E]'
                }`}
              >
                {isIncome ? '+' : '-'}$
                {Number(t.amount).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
