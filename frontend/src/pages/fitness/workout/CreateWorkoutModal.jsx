import { useState } from "react";

export default function CreateWorkoutModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();

        if (!name) return;

        onCreate({
            name,
            description
        });

        // reset fields
        setName("");
        setDescription("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

        {/* Modal Card */}
        <div className="bg-white rounded-3xl shadow-xl w-[420px] p-8">

            <h2 className="text-xl font-semibold mb-6">
            Create New Workout
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

            {/* Diet Name */}
            <div>
                <label className="text-sm text-gray-600">Workout Name</label>
                <input
                type="text"
                placeholder="Lean Bulk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 mt-1"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
                >
                Cancel
                </button>

                <button
                type="submit"
                className="bg-gray-900 text-white px-5 py-2 rounded-lg"
                >
                    Create
                </button>
            </div>

            </form>
        </div>
        </div>
    );
}
