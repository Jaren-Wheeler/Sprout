import FeaturePlaceholder from '../../components/FeaturePlaceholder';

export default function Notes() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6">
      <FeaturePlaceholder
        title="Notes"
        description="A space for thoughts, planning, and reflection."
        features={[
          'Quick notes and rich text',
          'Link notes to budgets or calendar events',
          'Search and tagging',
        ]}
      />
    </div>
  );
}
