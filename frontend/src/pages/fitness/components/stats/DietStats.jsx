import CalorieCard from './CalorieCard';
import MacroTargetsCard from './MacroTargetsCard';
import note1 from "../../../../assets/note1.png";

export default function DietStats({ stats, onEditGoals }) {
  if (!stats) {
    return (
      <div className="flex flex-wrap justify-center gap-8">
        <div
          onClick={onEditGoals}
          style={{
            backgroundImage: `url(${note1})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            padding: '50px 40px',
            minWidth: '280px',
            textAlign: 'center',
            transform: 'rotate(-2deg)',
            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.15))'
          }}
        >
          <h2 className="mb-2 text-lg font-semibold text-amber-900 dark:text-[#3f2612]">
            Energy Summary
          </h2>

          <p className="text-sm text-amber-900/70 dark:text-[rgba(63,38,18,0.78)]">
            Click to create your diet goals!
          </p>
        </div>

        <div
          onClick={onEditGoals}
           className="cursor-pointer transition-transform hover:scale-105"
           style={{
            backgroundImage: `url(${note1})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            padding: '50px 40px',
            minWidth: '100px',
            textAlign: 'center',
            transform: 'rotate(2deg)',
            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.15))'
          }}
        >
          <h2 className="mb-2 text-lg font-semibold text-amber-900 dark:text-[#3f2612]">
            Macro Targets
          </h2>

          <p className="text-sm text-amber-900/70 dark:text-[rgba(63,38,18,0.78)]">
            Click to add your diet goals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 items-start">
      <div className="rotate-[-1.5deg] transition-transform hover:rotate-0 shadow-xl rounded-2xl overflow-hidden">
        <CalorieCard
          calorieGoal={stats.calorieGoal}
          caloriesConsumed={stats.caloriesConsumed}
          currentWeight={stats.currentWeight}
          goalWeight={stats.goalWeight}
          onEdit={onEditGoals}
        />
      </div>
      
      <div className="rotate-[1.5deg] transition-transform hover:rotate-0 shadow-xl rounded-2xl overflow-hidden">
        <MacroTargetsCard
          proteinGoal={stats.proteinGoal}
          carbsGoal={stats.carbsGoal}
          fatGoal={stats.fatGoal}
          proteinConsumed={stats.proteinConsumed}
          carbsConsumed={stats.carbsConsumed}
          fatConsumed={stats.fatConsumed}
          onEdit={onEditGoals}
        />
      </div>
      
    </div>
  );
}
