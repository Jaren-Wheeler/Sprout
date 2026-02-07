export default function BudgetSummary() {
  return (
    <div className="rounded-xl bg-purple-200/90 text-black p-6 border border-black/10">
      <h2 className="font-semibold mb-4">Overall Spending</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryItem label="Total Budget" value="$1380.00" />
        <SummaryItem label="Total Spent" value="$550.80" />
        <SummaryItem label="Remaining" value="$829.20" highlight />
      </div>
    </div>
  );
}

function SummaryItem({ label, value, highlight }) {
  return (
    <div className="rounded-lg bg-white/80 p-4">
      <div className="text-sm">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-green-700' : ''}`}>
        {value}
      </div>
    </div>
  );
}
