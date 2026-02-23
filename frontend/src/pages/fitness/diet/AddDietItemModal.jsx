import { useState } from "react";

export default function AddDietItemModal({ isOpen, meal, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [sugar, setSugar] = useState("");

    if (!isOpen) return null;

    function handleSubmit(e, preset) {
        e.preventDefault();

        if (!name || !calories) return;

        onCreate({
            name,
            meal,
            presetMeal: preset,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
            sugar: Number(sugar)
        });
        
        // reset fields
        setName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setSugar("");
    
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            {/* Modal Card */}
            <div className="bg-white rounded-3xl shadow-xl w-[420px] p-8">

                <h2 className="text-xl font-semibold mb-6">
                    Log a food item
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Food Name */}
                    <div>
                        <label className="text-sm text-gray-600">Food Name</label>
                        <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                     {/* Calorie Amount */}
                    <div>
                        <label className="text-sm text-gray-600">Calories (kCal)</label>
                        <input
                        type="text"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                     {/* Protein Amount */}
                    <div>
                        <label className="text-sm text-gray-600">Protein (g)</label>
                        <input
                        type="text"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                     {/* Carb Amount */}
                    <div>
                        <label className="text-sm text-gray-600">Carbs (g)</label>
                        <input
                        type="text"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                     {/* Fat Amount */}
                    <div>
                        <label className="text-sm text-gray-600">Fat (g)</label>
                        <input
                        type="text"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                     {/* Sugar Amount */}
                    <div>
                        <label className="text-sm text-gray-600">Sugar (g)</label>
                        <input
                        type="text"
                        value={sugar}
                        onChange={(e) => setSugar(e.target.value)}
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
                            onClick={(e) => handleSubmit(e, false)}
                            className="bg-gray-900 text-white px-5 py-2 rounded-lg"
                        >
                            Create
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => handleSubmit(e,true)}
                            className="bg-gray-900 text-white px-5 py-2 rounded-lg"
                        >
                            Save as preset
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
