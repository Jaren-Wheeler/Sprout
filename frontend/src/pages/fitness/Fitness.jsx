import FeaturePlaceholder from '../../components/FeaturePlaceholder';

export default function Fitness() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6">
      <FeaturePlaceholder
        title="Fitness"
        description="Track workouts, routines, and long-term progress."
        features={[
          'Workout logging',
          'Exercise history and progression',
          'Routine templates',
          'Integration with calendar scheduling',
        ]}
      />
    </div>
  );
}
