
import { useState, useEffect } from 'react';
import LogFoodCard from './LogFoodCard'
import MealPlanningCard from './MealPlanningCard';
import DietCharts from './DietCharts';
import FoodListCard from './FoodListCard';
import DietCard from './DietCard';


export default function DietPage({ diet, diets, dietItems, setDietItems, onDeleteDiet, onSelectDiet }) {

    if (!diet) return null;

    return (
        <div className="rounded-2xl border bg-white w-[100%] p-5 mt-8 m-auto flex flex-col gap-5">
            <div className="flex space-between">
                <h1 className="text-2xl font-bold">{diet.name}</h1>
                <DietCard
                    diets={diets}
                    selectedDiet={diet}
                    onSelect={onSelectDiet}
                />
            </div>
            <div className="flex gap-5">
                <LogFoodCard diet={diet}></LogFoodCard>
                <FoodListCard 
                    diet={diet}
                    items={dietItems}
                    setItems={setDietItems}
                >
                </FoodListCard>
                <div className=" w-[95%] flex flex-col gap-5 self-start h-full">
                    <MealPlanningCard 
                        diet={diet}
                        onAddDietItem={(item) => {
                        setDietItems(prev => [...prev, item])
                    }}>
                    </MealPlanningCard>
                    <div className="mt-auto">
                        <DietCharts diet={diet} dietItems={dietItems}></DietCharts>
                    </div> 
                </div>
            </div> 
        </div>
    );
}