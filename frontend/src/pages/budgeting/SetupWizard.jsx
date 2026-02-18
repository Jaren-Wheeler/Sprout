/**
 * SetupWizard
 *
 * First time budgeting setup.
 * Step 1: collect expected income
 * Step 2: configure spending categories
 */

import { useState } from "react";
import { updateExpectedIncome, createBudget } from "../../api/finance";

const defaultCategories = [
  { id: 1, name: "Food", limitAmount: 400 },
  { id: 2, name: "Housing", limitAmount: 1200 },
  { id: 3, name: "Transport", limitAmount: 300 },
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Category helpers
  // ---------------------------

  function updateCategory(id, field, value) {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  }

  function addCategory() {
    setCategories(prev => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        limitAmount: 0,
      },
    ]);
  }

  function removeCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  // ---------------------------
  // Finish setup
  // ---------------------------

  async function finishSetup() {
    if (!income) return;

    setLoading(true);

    try {
      await updateExpectedIncome(Number(income));

      // create budgets from category list
      for (const cat of categories) {
        if (!cat.name || !cat.limitAmount) continue;

        await createBudget({
          name: cat.name,
          limitAmount: Number(cat.limitAmount),
        });
      }

      onComplete();

    } catch (err) {
      alert(err.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------
  // UI
  // ---------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-lg bg-panel p-8 rounded-xl border border-border">

        {/* STEP 1 */}
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
              className="w-full p-2 rounded bg-bg border border-border mb-6"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <button
              className="w-full py-2 rounded bg-accent text-black font-medium"
              onClick={() => setStep(2)}
              disabled={!income}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Set Your Spending Categories
            </h2>

            <p className="text-muted mb-6">
              Adjust limits or add your own categories.
            </p>

            <div className="space-y-3 mb-6">
              {categories.map(cat => (
                <div key={cat.id} className="flex gap-3">
                  <input
                    className="flex-1 p-2 rounded bg-bg border border-border"
                    placeholder="Category"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategory(cat.id, "name", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="w-28 p-2 rounded bg-bg border border-border"
                    placeholder="Limit"
                    value={cat.limitAmount}
                    onChange={(e) =>
                      updateCategory(cat.id, "limitAmount", e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeCategory(cat.id)}
                    className="px-3 text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCategory}
              className="text-accent mb-6"
            >
              + Add Category
            </button>

            <button
              onClick={finishSetup}
              disabled={loading}
              className="w-full py-2 rounded bg-accent text-black font-medium"
            >
              {loading ? "Setting up…" : "Finish Setup"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
