export default function CategoryCard({ category, onClick }) {
  const percent = (category.spent / category.limitAmount) * 100 || 0;

  const isOver = percent > 100;
  const displayPercent = Math.min(percent, 100);

  return (
    <div
      onClick={() => onClick?.(category)}
      className={`
        min-w-[260px] max-w-[260px]
        sprout-card p-4 hover:scale-[1.02]
        ${isOver ? 'border-red-400' : ''}
      `}
    >
      {/* HEADER ROW */}
      <div className="flex justify-between items-start mb-1">
        <p className="font-semibold text-[#3B2F2F]">{category.name}</p>

        {isOver && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600">
            Over Budget
          </span>
        )}
      </div>

      {/* AMOUNT TEXT */}
      <p className="text-sm text-[#6B5E5E] mb-2">
        ${category.spent.toFixed(2)} of ${category.limitAmount}
      </p>

      {/* PROGRESS BAR */}
      <div className="h-2 bg-[#F3EED9] rounded overflow-hidden">
        <div
          className={`h-2 rounded transition-all duration-300 ${
            isOver ? 'bg-red-500' : 'bg-[#F4B400]'
          }`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>
    </div>
  );
}
