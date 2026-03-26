import { useState } from 'react';
import { createExpense, createIncomeEntry } from '../../api/finance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../../validation/budgetSchema';
import SproutCurrencyInput from '../../components/ui/SproutCurrencyInput';
import { stripCurrencyFormatting } from '../../utils/format';

export default function BudgetWorkspace({ categories, expenses, refreshData }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      description: '',
      amount: '',
      categoryId: '',
      type: 'expense',
    },
  });

  const type = watch('type');

  async function onSubmit(data) {
    setLoading(true);

    try {
      const cleanAmount = Number(stripCurrencyFormatting(data.amount));

      if (data.type === 'income') {
        await createIncomeEntry({
          amount: cleanAmount,
          note: data.description,
          incomeDate: new Date().toISOString(),
        });
      } else {
        const selectedCategory = categories.find(
          (c) => String(c.id) === String(data.categoryId)
        );

        await createExpense({
          amount: cleanAmount,
          description: data.description,
          category: selectedCategory?.name || 'Other',
          expenseDate: new Date().toISOString(),
          budgetId: data.categoryId,
        });
      }

      reset({
        description: '',
        amount: '',
        categoryId: '',
        type: data.type,
      });

      await refreshData();
    } catch (err) {
      alert(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col px-2 pb-10 pt-2 md:px-1 md:pb-9 md:pt-1">
      <h2 className="mb-6 text-lg font-semibold text-[#3B2F2F]">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-1 min-h-[400px] flex-col"
      >
        <input type="hidden" {...register('type')} />

        <div className="flex-1 space-y-4">
          <div>
            <input
              className={`sprout-input ${
                errors.description ? 'sprout-input-error' : ''
              }`}
              placeholder="Description"
              {...register('description')}
            />
            {errors.description && (
              <p className="sprout-error-text">{errors.description.message}</p>
            )}
          </div>

          <SproutCurrencyInput
            register={register}
            name="amount"
            error={errors.amount}
            placeholder="Amount"
          />

          {type === 'expense' && (
            <div>
              <select
                className={`sprout-input ${
                  errors.categoryId ? 'sprout-input-error' : ''
                }`}
                {...register('categoryId')}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {errors.categoryId && (
                <p className="sprout-error-text">{errors.categoryId.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto space-y-4 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue('type', 'expense')}
              className={`flex-1 min-w-0 ${
                type === 'expense'
                  ? 'sprout-btn-base sprout-btn-danger'
                  : 'sprout-btn-muted'
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setValue('type', 'income')}
              className={`flex-1 min-w-0 ${
                type === 'income'
                  ? 'sprout-btn-base sprout-btn-success'
                  : 'sprout-btn-muted'
              }`}
            >
              Income
            </button>
          </div>

          <button
            disabled={loading || isSubmitting}
            className="w-full sprout-btn-primary"
          >
            {loading ? 'Adding...' : '+ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
