import { useState } from 'react';
import { updateExpectedIncome, createBudget } from '../../api/finance';
import { Trash2 } from 'lucide-react';

const defaultCategories = [
  { id: 1, name: 'Food', limitAmount: 400 },
  { id: 2, name: 'Housing', limitAmount: 1200 },
  { id: 3, name: 'Transport', limitAmount: 300 },
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);

  function updateCategory(id, field, value) {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  }

  function addCategory() {
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: '', limitAmount: 0 },
    ]);
  }

  function removeCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function finishSetup() {
    if (!income) return;

    setLoading(true);

    try {
      await updateExpectedIncome(Number(income));

      for (const cat of categories) {
        if (!cat.name || !cat.limitAmount) continue;

        await createBudget({
          name: cat.name,
          limitAmount: Number(cat.limitAmount),
        });
      }

      onComplete();
    } catch (err) {
      alert(err.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="sprout-panel w-full max-w-lg p-8">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Welcome to Sprout Budgeting
            </h2>

            <p className="text-muted mb-6">
              Let’s start by setting your expected monthly income.
            </p>

            <input
              type="number"
              placeholder="Monthly income"
              className="sprout-input mb-6"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <button
              className="w-full sprout-btn-primary"
              onClick={() => setStep(2)}
              disabled={!income}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Set Your Spending Categories
            </h2>

            <p className="text-muted mb-6">
              Adjust limits or add your own categories.
            </p>

            <div className="space-y-3 mb-6">
              {categories.map((cat) => (
                <div key={cat.id} className="flex gap-3 items-center">
                  <input
                    className="flex-1 sprout-input"
                    placeholder="Category"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(cat.id, 'name', e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="w-28 sprout-input"
                    placeholder="Limit"
                    value={cat.limitAmount}
                    onChange={(e) =>
                      updateCategory(cat.id, 'limitAmount', e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeCategory(cat.id)}
                    className="sprout-icon-btn-danger"
                    title="Remove category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCategory}
              className="sprout-btn-muted mb-6 px-4 py-2"
            >
              + Add Category
            </button>

            <button
              onClick={finishSetup}
              disabled={loading}
              className="w-full sprout-btn-primary"
            >
              {loading ? 'Setting up…' : 'Finish Setup'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
