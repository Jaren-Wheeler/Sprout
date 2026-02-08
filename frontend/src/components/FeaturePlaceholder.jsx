export default function FeaturePlaceholder({
  title,
  description,
  features = [],
}) {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl bg-panel border border-border p-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <span className="ml-auto rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
          In Progress
        </span>
      </div>

      <p className="text-muted mb-6">{description}</p>

      <div className="space-y-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-lg bg-black/20 border border-white/10 px-4 py-3 text-sm"
          >
            {f}
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted italic">
        This module has full backend support and is ready to be expanded.
      </div>
    </div>
  );
}
