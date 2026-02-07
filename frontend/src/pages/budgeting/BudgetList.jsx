import BudgetCard from './BudgetCard';
import { useState, useEffect } from 'react';
import { getBudgets } from '../../api/finance';

/*const mockBudgets = [
  { id: 1, name: 'Entertainment', spent: 120, total: 200 },
  { id: 2, name: 'Coffee & Treats', spent: 30.5, total: 100 },
  { id: 3, name: 'Fitness', spent: 50, total: 150 },
];*/

export default function BudgetList({ onSelectBudget }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBudgets() {
      try {
        const data = await getBudgets();
        setBudgets(data);
      } catch (err) {
        setError(err.message || "Failed to load budgets");
      } finally {
        setLoading(false);
      }
    }

    loadBudgets(false);
  },[]);

  return (
    <div className="border border-border rounded-xl bg-panel p-4">
      <h2 className="font-semibold mb-4">All Budgets</h2>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {budgets.map((b) => (
          <BudgetCard 
            key={b.id} 
            budget={b} 
            onClick={()=> onSelectBudget(b.id)}
          />
        ))}
      </div>
    </div>
  );
}
