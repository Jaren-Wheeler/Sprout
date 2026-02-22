import MealCard from './MealCard';
import { useState, useEffect } from 'react';
import { getDietItems } from '../../../api/health';
export default function MealPlanningCard({diet}) {
    const [items, setItems] = useState([]);

    const presets = items.filter(item => item.presetMeal === true);

    useEffect(() => {
        async function loadItems() {
            const data = await getDietItems(diet.id);
            setItems(data ?? []);
        }

        loadItems();
    }, []);

    return (
        <div className="rounded-2xl border bg-[green] p-5">
            <h2>Your Saved Meals</h2>
            <div className="flex gap-5 pt-5">
                {presets.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-lg">
                        <MealCard item={p}></MealCard>
                    </div>
                ))}
            </div>
        </div>
    )
}