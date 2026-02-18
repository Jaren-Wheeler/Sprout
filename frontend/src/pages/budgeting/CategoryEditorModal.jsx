import { useState } from "react";
import { updateBudget, deleteBudget, createBudget } from "../../api/finance";

export default function CategoryEditorModal({
  category,
  onClose,
  onSaved,
}) {
  const isNew = category === "new";

  const [name, setName] = useState(isNew ? "" : category.name);
  const [limitAmount, setLimitAmount] = useState(
    isNew ? "" : category.limitAmount
  );
  const [loading, setLoading] = useState(false);

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
    if (!confirm("Delete this category?")) return;

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          {isNew ? "Add Category" : "Edit Category"}
        </h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Limit"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
        />

        <div className="flex justify-between">
          {!isNew && (
            <button onClick={handleDelete} className="text-red-500">
              Delete
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button onClick={onClose}>Cancel</button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="bg-accent px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
