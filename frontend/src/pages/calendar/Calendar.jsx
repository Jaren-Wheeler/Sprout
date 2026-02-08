import FeaturePlaceholder from '../../components/FeaturePlaceholder';

export default function Calendar() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6">
      <FeaturePlaceholder
        title="Calendar"
        description="A planner that can be integrated with other features as well as basic reminders!"
        features={[
          'Daily and weekly agenda views',
          'Budget-linked reminders',
          'Workout scheduling',
          'AI-assisted task planning',
        ]}
      />
    </div>
  );
}
