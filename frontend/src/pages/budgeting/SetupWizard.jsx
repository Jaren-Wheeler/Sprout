import { useState } from 'react';
import { updateExpectedIncome, createBudget } from '../../api/finance';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incomeSchema, categorySchema } from '../../validation/budgetSchema';

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
  const [categoryErrors, setCategoryErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(incomeSchema),
  });

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
    const newErrors = {};

    categories.forEach((cat) => {
      const result = categorySchema.safeParse({
        name: cat.name,
        limitAmount: String(cat.limitAmount),
      });

      if (!result.success) {
        const fieldErrors = {};

        result.error.issues.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });

        newErrors[cat.id] = fieldErrors;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      console.log('ERRORS:', newErrors);
      setCategoryErrors(newErrors);
      return;
    }

    setCategoryErrors({});
    setLoading(true);

    try {
      await updateExpectedIncome(Number(income));

      for (const cat of categories) {
        await createBudget({
          name: cat.name.trim(),
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

            <form
              onSubmit={handleSubmit((data) => {
                setIncome(data.income);
                setStep(2);
              })}
              noValidate
            >
              <input
                type="text"
                inputMode="decimal"
                placeholder="Monthly income"
                {...register('income')}
                className={`sprout-input mb-2 ${
                  errors.income ? 'sprout-input-error' : ''
                }`}
              />

              {errors.income && (
                <p className="sprout-error-text mb-4">
                  {errors.income.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full sprout-btn-primary"
                disabled={isSubmitting}
              >
                Continue
              </button>
            </form>
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

            <div className="space-y-1 mb-6">
              {categories.map((cat) => {
                const rowError =
                  categoryErrors[cat.id]?.name ||
                  categoryErrors[cat.id]?.limitAmount;

                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className="flex gap-3 items-center">
                      {/* Category Name */}
                      <input
                        type="text"
                        maxLength={30}
                        className={`flex-1 sprout-input ${
                          rowError ? 'sprout-input-error' : ''
                        }`}
                        placeholder="Category"
                        value={cat.name}
                        onChange={(e) =>
                          updateCategory(cat.id, 'name', e.target.value)
                        }
                      />

                      {/* Limit Amount */}
                      <input
                        type="text"
                        inputMode="decimal"
                        className={`w-28 sprout-input ${
                          rowError ? 'sprout-input-error' : ''
                        }`}
                        placeholder="Limit"
                        value={cat.limitAmount}
                        onChange={(e) =>
                          updateCategory(cat.id, 'limitAmount', e.target.value)
                        }
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() => removeCategory(cat.id)}
                        className="sprout-icon-btn-danger"
                        title="Remove category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Row Error */}
                    <p className="sprout-error-text min-h-[18px]">
                      {rowError || ''}
                    </p>
                  </div>
                );
              })}
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
