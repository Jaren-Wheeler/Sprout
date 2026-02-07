import BudgetCard from './BudgetCard';

const mockBudgets = [
  { id: 1, name: 'Entertainment', spent: 120, total: 200 },
  { id: 2, name: 'Coffee & Treats', spent: 30.5, total: 100 },
  { id: 3, name: 'Fitness', spent: 50, total: 150 },
];

export default function BudgetList() {
  return (
    <div className="border border-border rounded-xl bg-panel p-4">
      <h2 className="font-semibold mb-4">All Budgets</h2>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {mockBudgets.map((b) => (
          <BudgetCard key={b.id} budget={b} />
        ))}
      </div>
    </div>
  );
}
