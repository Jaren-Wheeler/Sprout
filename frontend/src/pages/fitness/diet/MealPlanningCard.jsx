import MealCard from './MealCard';

export default function MealPlanningCard() {
    
    return (
        <div className="rounded-2xl border bg-[green]">
            <h2>Meal planning</h2>
            <div className="flex gap-5">
                <MealCard></MealCard>
            </div>
        </div>
    )
}