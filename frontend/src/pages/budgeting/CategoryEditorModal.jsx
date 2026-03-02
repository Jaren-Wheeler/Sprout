import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateBudget, deleteBudget, createBudget } from '../../api/finance';
import { Trash2 } from 'lucide-react';

export default function CategoryEditorModal({ category, onClose, onSaved }) {
  const isNew = category === 'new';

  const [name, setName] = useState(isNew ? '' : category.name);
  const [limitAmount, setLimitAmount] = useState(
    isNew ? '' : category.limitAmount
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  async function handleSave() {
    if (!name || !limitAmount) return;

    setLoading(true);

    try {
      if (isNew) {
        await createBudget({
          name,
          limitAmount: Number(limitAmount),
        });
      } else {
        await updateBudget(category.id, {
          name,
          limitAmount: Number(limitAmount),
        });
      }

      await onSaved();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this category?')) return;

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

  return createPortal(
    <div className="sprout-modal-backdrop animate-fadeIn" onClick={onClose}>
      <div
        className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">
          {isNew ? 'Add Category' : 'Edit Category'}
        </h2>

        <input
          className="sprout-input"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="sprout-input"
          placeholder="Limit"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
        />

        <div className="flex justify-between items-center pt-3">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="sprout-icon-btn-danger"
              title="Delete category"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button onClick={onClose} className="sprout-btn-muted px-4 py-2">
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="sprout-btn-primary px-5 py-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
