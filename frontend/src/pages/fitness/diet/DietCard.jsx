

import { useState } from "react";

export default function DietCard({ diets = [], selectedDiet, onSelect }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-[260px] ml-auto z-50">
            {/* Trigger */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="w-full flex justify-between items-center px-4 py-2 rounded-xl border bg-white shadow-sm hover:bg-gray-50"
            >
                <span>{selectedDiet?.name || "Select Diet"}</span>
                <span>▾</span>
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-full bg-white border rounded-xl shadow-lg z-50">
                    {diets.map(diet => (
                        <div
                            key={diet.id}
                            onClick={() => {
                                onSelect(diet);
                                setOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {diet.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}