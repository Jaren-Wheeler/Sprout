export default function FoodItem({ item, onDelete }) {
    return (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            
            {/* LEFT SIDE */}
            <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">
                    {item.meal.charAt(0).toUpperCase() + item.meal.slice(1).toLowerCase()}
                </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
                <p className="text-xl font-medium">{item.calories} cal</p>

                <button
                    onClick={() => onDelete(item.id)}
                    className="text-gray-400 hover:text-red-500 text-xl transition"
                >
                    ✕
                </button>
            </div>

        </div>
    );
}