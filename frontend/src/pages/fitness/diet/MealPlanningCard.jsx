import MealCard from './MealCard';
import { useState, useEffect } from 'react';
import { getPresetItems, addDietItem, deletePresetItem } from '../../../api/health';

export default function MealPlanningCard({ diet }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function loadItems() {
            const data = await getPresetItems(diet.id);
            setItems(data ?? []);
        }

        if (diet?.id) loadItems();
    });

   async function handleSubmit(preset) {
        const newItem = await addDietItem({
            dietId: diet.id,         
            name: preset.name,
            meal: preset.meal,
            calories: preset.calories,
            protein: preset.protein,
            carbs: preset.carbs,
            fat: preset.fat,
            sugar: preset.sugar
        });

        setItems(prev => [...prev, newItem]);
    }

     // delete a diet item
    async function handleDelete(id) {
        try {
            await deletePresetItem(diet.id, id);

            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            return err;
        }
    }

    return (
        <div className="rounded-2xl border bg-[green] p-5">
            <h2>Your Saved Meals</h2>

            <div className="flex gap-5 pt-5">
                {items.map(p => (
                    <div
                        key={p.id}
                        className="bg-white p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSubmit(p)} 
                    >
                        <MealCard item={p} onDelete={handleDelete}/>
                    </div>
                ))}
            </div>
        </div>
    );
}