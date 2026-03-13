export default function SproutCard({ title, right, height = 540, children }) {
  return (
    <div
      className="sprout-paper p-5 flex flex-col overflow-hidden"
      style={{ height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-amber-900">{title}</h2>
        {right}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}
