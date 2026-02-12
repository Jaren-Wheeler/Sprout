import { useState } from 'react';
import { useMemo } from "react";
import CreateFitnessProfileModal from "./CreateFitnessProfileModal";
import Progress from "../../components/Progress";
import Stat from '../../components/Stat';
export default function FitnessProfile({
    profile,
    onEditGoals,    // callback
}) {

    const {
        currentWeight,
        startingWeight,
        goalWeight,
        caloriesLost,
        calorieGoal,
        lastUpdated,
    } = profile;

    const stats = useMemo(() => {
        const weightLost = startingWeight - currentWeight;
        const weightRemaining = currentWeight - goalWeight;

        const calorieProgress =
        calorieGoal > 0 ? (caloriesLost / calorieGoal) * 100 : 0;

        const totalWeightGoal = startingWeight - goalWeight;
        const weightProgress =
        totalWeightGoal > 0 ? (weightLost / totalWeightGoal) * 100 : 0;

        return {
            weightLost,
            weightRemaining,
            calorieProgress: Math.min(calorieProgress, 100),
            weightProgress: Math.min(weightProgress, 100),
        };
    }, [startingWeight, goalWeight, caloriesLost, calorieGoal]);

    return (
        <div className="w-full rounded-2xl border bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                <h2 className="text-lg font-semibold">Fitness Profile</h2>
                <p className="text-sm text-gray-500">
                    Last updated: {lastUpdated}
                </p>
                </div>

                <button
                onClick={onEditGoals}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                    Edit goals
                </button>
            </div>

            {/* Weight stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Current weight" value={`${currentWeight} lb`} />
                <Stat label="Starting weight" value={`${startingWeight} lb`} />
                <Stat label="Weight lost" value={`${stats.weightLost} lb`} />
                <Stat label="To goal" value={`${stats.weightRemaining} lb`} />
            </div>

            {/* Goals */}
            <div className="mt-5 space-y-4">
                <Progress
                    label="Daily calorie progress"
                    value={`${caloriesLost} / ${calorieGoal} kcal`}
                    percent={stats.calorieProgress}
                />

                <Progress
                    label="Weight goal progress"
                    value={`${stats.weightLost} / ${startingWeight - goalWeight} lb`}
                    percent={stats.weightProgress}
                />
            </div>
        </div>
    );
}
