import { useState } from 'react';
import { useMemo } from "react";
import CreateFitnessProfileModal from "./createFitnessProfileModal";

export default function FitnessProfile({
  profile,        // object from DB
  onEditGoals,    // callback
}) {

    if (!profile) {
        return (
            <CreateFitnessProfileModal
                onSubmit={(profile) => {
                    // Save to DB here
                    console.log(profile);
                }}
            />
        );
    }

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
    }, [startingWeight, currentWeight, goalWeight, caloriesLost, calorieGoal]);

    return (
        <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-sm">
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
                label="Calorie loss goal"
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

    /* ---------- Subcomponents ---------- */

    function Stat({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
        </div>
    );
    }

    function Progress({ label, value, percent }) {
    return (
        <div>
        <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium">{label}</span>
            <span className="text-gray-500">{value}</span>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200">
            <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${percent}%` }}
            />
        </div>
        </div>
    );
}
