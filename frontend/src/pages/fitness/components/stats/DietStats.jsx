import CalorieCard from './CalorieCard';
import MacroTargetsCard from './MacroTargetsCard';
import note1 from "../../../../assets/note1.png";

export default function DietStats({ stats, onEditGoals }) {
  if (!stats) {
    return (
      <div className="grid w-full max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          onClick={onEditGoals}
          className="cursor-pointer transition-transform hover:scale-[1.01]"
          style={{
            backgroundImage: `url(${note1})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '260px',
            width: '100%',
            padding: '56px 48px',
            textAlign: 'center',
            transform: 'rotate(-2deg)',
            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.15))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2
            className="mb-2 text-lg font-semibold"
            style={{ color: '#6b3f12' }}
          >
            Energy Summary
          </h2>

          <p
            className="text-sm"
            style={{ color: 'rgba(107, 63, 18, 0.82)' }}
          >
            Click to create your diet goals!
          </p>
        </div>

        <div
          onClick={onEditGoals}
          className="cursor-pointer transition-transform hover:scale-[1.01]"
          style={{
            backgroundImage: `url(${note1})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '260px',
            width: '100%',
            padding: '56px 48px',
            textAlign: 'center',
            transform: 'rotate(2deg)',
            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.15))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2
            className="mb-2 text-lg font-semibold"
            style={{ color: '#6b3f12' }}
          >
            Macro Targets
          </h2>

          <p
            className="text-sm"
            style={{ color: 'rgba(107, 63, 18, 0.82)' }}
          >
            Click to add your diet goals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-[1280px] grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
      <div className="w-full rotate-[-1.5deg] transition-transform hover:rotate-0">
        <CalorieCard
          calorieGoal={stats.calorieGoal}
          caloriesConsumed={stats.caloriesConsumed}
          currentWeight={stats.currentWeight}
          goalWeight={stats.goalWeight}
          onEdit={onEditGoals}
        />
      </div>
      
      <div className="w-full rotate-[1.5deg] transition-transform hover:rotate-0">
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
