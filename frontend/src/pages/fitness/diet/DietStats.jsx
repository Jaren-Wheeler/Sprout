import {useState, useEffect} from 'react';
import Progress from "../../../components/Progress";
import Stat from "../../../components/Stat";

export default function DietStats({stats, diet, dietItems}) {

    const todayString = new Date().toDateString();

    const consumedCalories = (dietItems || [])
        .filter(item => item.createdAt)
        .filter(item => 
            new Date(item.createdAt).toDateString() === todayString
        )
        .reduce((sum, item) => sum + (item.calories || 0), 0);

    const calorieProgress =
        stats.calorieGoal > 0
            ? (consumedCalories / stats.calorieGoal) * 100
            : 0;


    const date = new Date();
    return (
        <div className="rounded-2xl border bg-white p-8 text-center">
            <h2>Your stats for {date.toDateString()}</h2>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Current weight" value={`${stats.currentWeight} lb`} />
                <Stat label="Calories Consumed" value={`${consumedCalories} kCal`} />
                <Stat label="Calorie Goal" value={`${stats.calorieGoal} lb`} />
                <Stat label="Calories remaining" value={`${stats.calorieGoal - consumedCalories} lb`} />
            </div>

            <Progress
                label="Daily calorie progress"
                value={`${consumedCalories} / ${stats.calorieGoal} kcal`}
                percent={calorieProgress}
            />
        </div>
    );
}