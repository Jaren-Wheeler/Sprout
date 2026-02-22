import MealCard from './MealCard';
import { useState, useEffect } from 'react';
export default function MealPlanningCard() {
    const [presetItems, setPresetItems] = useState([]);

    return (
        <div className="rounded-2xl border bg-[green]">
            <h2>Meal planning</h2>
            <div className="flex gap-5">
                {presetItems.map(item => {
                    <MealCard></MealCard>
                })}
                
            </div>
        </div>
    )
}