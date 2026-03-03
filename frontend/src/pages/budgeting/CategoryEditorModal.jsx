import { useState } from 'react';
import { updateBudget, deleteBudget, createBudget } from '../../api/finance';
import { Trash2 } from 'lucide-react';
import SproutModal from '../../components/ui/SproutModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import SproutCurrencyInput from '../../components/ui/SproutCurrencyInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../../validation/budgetSchema';
import { stripCurrencyFormatting } from '../../utils/format';

export default function CategoryEditorModal({ category, onClose, onSaved }) {
  const isNew = category === 'new';
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: isNew ? '' : category.name,
      limitAmount: isNew ? '' : String(category.limitAmount),
    },
  });

  async function onSubmit(data) {
    setLoading(true);

    try {
      const payload = {
        name: data.name.trim(),
        limitAmount: Number(stripCurrencyFormatting(data.limitAmount)),
      };

      if (isNew) {
        await createBudget(payload);
      } else {
        await updateBudget(category.id, payload);
      }

      await onSaved();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    setConfirmDeleteOpen(false);
    setLoading(true);

    try {
      await deleteBudget(category.id);
      await onSaved();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SproutModal onClose={onClose}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg"
        >
          <h2 className="text-xl font-semibold">
            {isNew ? 'Add Category' : 'Edit Category'}
          </h2>

          {/* Name */}
          <div>
            <input
              maxLength={30}
              className={`sprout-input ${
                errors.name ? 'sprout-input-error' : ''
              }`}
              placeholder="Category name"
              {...register('name')}
            />
            {errors.name && (
              <p className="sprout-error-text">{errors.name.message}</p>
            )}
          </div>

          {/* Limit */}
          <SproutCurrencyInput
            register={register}
            name="limitAmount"
            error={errors.limitAmount}
            placeholder="Limit"
          />

          <div className="flex justify-between items-center pt-3">
            {!isNew && (
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                className="sprout-icon-btn-danger"
                title="Delete category"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="sprout-btn-muted px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="sprout-btn-primary px-5 py-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </SproutModal>

      {confirmDeleteOpen && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? This cannot be undone."
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </>
  );
}
