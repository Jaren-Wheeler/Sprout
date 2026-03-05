import LogFoodCard from './LogFoodCard';
import MealPlanningCard from './MealPlanningCard';
import DietCharts from './DietCharts';
import FoodListCard from './FoodListCard';
import DietCard from './DietCard';

export default function DietPage({
  diet,
  diets,
  dietItems,
  setDietItems,
  onDeleteDiet,
  onSelectDiet,
  weightHistory,
}) {
  if (!diet) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="sprout-title text-[32px]">{diet.name}</h1>

        <DietCard diets={diets} selectedDiet={diet} onSelect={onSelectDiet} />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-[220px_1fr_1.3fr] gap-6 items-start">
        {/* LEFT COLUMN */}
        <LogFoodCard
          diet={diet}
          onItemCreated={(newItem) => {
            setDietItems((prev) => [newItem, ...prev]);
          }}
        />

        {/* CENTER COLUMN */}
        <FoodListCard diet={diet} items={dietItems} setItems={setDietItems} />

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 h-full">
          <MealPlanningCard
            diet={diet}
            onAddDietItem={(item) => {
              setDietItems((prev) => [item, ...prev]);
            }}
          />

          <div className="flex-1">
            <DietCharts
              diet={diet}
              dietItems={dietItems}
              weightHistory={weightHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
