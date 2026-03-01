import Progress from "../../../components/Progress";
import Stat from "../../../components/Stat";

export default function DietStats({ stats, diet, dietItems, onEditGoals }) {

    if (!stats || !diet) return null;

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

    return (
        <div className="rounded-2xl border bg-white p-8 text-center">
            <h2>Your stats for {new Date().toDateString()}</h2>
            <button
                onClick={onEditGoals}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 mt-2"
            >
                Edit goals
            </button>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Current weight" value={`${stats.currentWeight} lb`} />
                <Stat label="Calories Consumed" value={`${consumedCalories} kCal`} />
                <Stat label="Calorie Goal" value={`${stats.calorieGoal} kCal`} />
                <Stat
                    label="Calories remaining"
                    value={`${Math.max(stats.calorieGoal - consumedCalories, 0)} kCal`}
                />
            </div>

            <Progress
                label="Daily calorie progress"
                value={`${consumedCalories} / ${stats.calorieGoal} kcal`}
                percent={calorieProgress}
            />
        </div>
    );
}