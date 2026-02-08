import FeaturePlaceholder from '../../components/FeaturePlaceholder';

export default function Notes() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6">
      <FeaturePlaceholder
        title="Notes"
        description="A lightweight space for thoughts, planning, and quick capture."
        features={[
          'Quick notes and rich text',
          'Link notes to budgets or calendar events',
          'Search and tagging',
        ]}
      />
    </div>
  );
}
