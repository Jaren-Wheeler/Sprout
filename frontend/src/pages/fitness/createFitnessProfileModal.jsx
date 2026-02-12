import { useState, useEffect } from 'react';

export default function CreateFitnessProfileModal({
  onClose,
  onDelete,
  onSubmit,
  onEditGoals
}) {

  const [form, setForm] = useState({
    currentWeight: "",
    goalWeight: "",
    calorieGoal: "",
    age: "",
    height: ""
  });

  // Prefill when editing
  useEffect(() => {
    if (onEditGoals) {
      setForm({
        currentWeight: onEditGoals.currentWeight ?? "",
        goalWeight: onEditGoals.goalWeight ?? "",
        calorieGoal: onEditGoals.calorieGoal ?? "",
        age: onEditGoals.age ?? "",
        height: onEditGoals.height ?? ""
      });
    }
  }, [onEditGoals])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal */}
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-lg">
        {onEditGoals ? (
          <h1 className="mb-4 text-lg font-semibold text-gray-800">
            Update your fitness goals!
          </h1>
         ) : (
          <h1 className="mb-4 text-lg font-semibold text-gray-800">
            Start your fitness journey by creating a fitness profile!
          </h1>
         )}
        

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            onSubmit({
              currentWeight: Number(formData.get("currentWeight")),
              goalWeight: Number(formData.get("goalWeight")),
              calorieGoal: Number(formData.get("calorieGoal")),
              age: Number(formData.get("age")),
              heightFt: Number(formData.get("height"))
            });
          }}
          className="space-y-4"
        >
        <label className="mb-1 block text-sm font-medium text-gray-700">
            Current Weight (lbs)
        </label>
        <input
            name="currentWeight"
            type="number"
            required
            value={form.currentWeight}
            onChange={(e) => setForm({...form, currentWeight: e.target.value})}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label className="mb-1 block text-sm font-medium text-gray-700">
            Goal Weight (lbs)
        </label>
        <input
            name="goalWeight"
            type="number"
            required
            value={form.goalWeight}
            onChange={(e) => setForm({...form, goalWeight: e.target.value})}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label className="mb-1 block text-sm font-medium text-gray-700">
            Daily Calorie Goal
        </label>
        <input
            name="calorieGoal"
            type="number"
            required
            value={form.calorieGoal}
            onChange={(e) => setForm({...form, calorieGoal: e.target.value})}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label className="mb-1 block text-sm font-medium text-gray-700">
            Age
        </label>
        <input
            name="age"
            type="number"
            required
            value={form.age}
            onChange={(e) => setForm({...form, age: e.target.value})}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label className="mb-1 block text-sm font-medium text-gray-700">
            Height (ft)
        </label>
        <input
            name="height"
            type="number"
            required
            value={form.height}
            onChange={(e) => setForm({...form, height: e.target.value})}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
                type="button"
                onClick={onDelete}
                className="rounded-lg bg-red-600 border px-4 py-2 text-sm hover:bg-gray-50"
                >
                Delete profile
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
