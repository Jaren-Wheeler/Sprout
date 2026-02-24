import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateBudget, deleteBudget, createBudget } from '../../api/finance';

export default function CategoryEditorModal({ category, onClose, onSaved }) {
  const isNew = category === 'new';

  const [name, setName] = useState(isNew ? '' : category.name);
  const [limitAmount, setLimitAmount] = useState(
    isNew ? '' : category.limitAmount
  );
  const [loading, setLoading] = useState(false);

  /* =========================
     SCROLL LOCK + ESC CLOSE
  ========================== */
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

  /* =========================
     ACTION HANDLERS
  ========================== */
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

  /* =========================
     RENDER
  ========================== */
  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-panel border border-border text-primary rounded-xl p-6 w-full max-w-md space-y-5 shadow-lg animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">
          {isNew ? 'Add Category' : 'Edit Category'}
        </h2>

        <input
          className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition"
          placeholder="Limit"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
        />

        <div className="flex justify-between items-center pt-2">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 transition"
            >
              Delete
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-muted hover:bg-background transition"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
