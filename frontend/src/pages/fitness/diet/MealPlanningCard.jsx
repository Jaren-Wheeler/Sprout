import MealCard from './MealCard';
import { useState, useEffect } from 'react';
import { getDietItems, addDietItem } from '../../../api/health';

export default function MealPlanningCard({ diet }) {
    const [items, setItems] = useState([]);

    const presets = items.filter(item => item.presetMeal);

    useEffect(() => {
        async function loadItems() {
            const data = await getDietItems(diet.id);
            setItems(data ?? []);
        }

        if (diet?.id) loadItems();
    });

   async function handleSubmit(preset) {
        const newItem = await addDietItem({
            id: diet.id,         
            name: preset.name,
            meal: preset.meal,
            presetMeal: false,
            calories: preset.calories,
            protein: preset.protein,
            carbs: preset.carbs,
            fat: preset.fat,
            sugar: preset.sugar
        });

        setItems(prev => [...prev, newItem]);
    }

    return (
        <div className="rounded-2xl border bg-[green] p-5">
            <h2>Your Saved Meals</h2>

            <div className="flex gap-5 pt-5">
                {presets.map(p => (
                    <div
                        key={p.id}
                        className="bg-white p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSubmit(p)} 
                    >
                        <MealCard item={p} />
                    </div>
                ))}
            </div>
        </div>
    );
}