export default function CategoryCard({ category, onClick }) {
  const percent = (category.spent / category.limitAmount) * 100 || 0;

  return (
    <div
      onClick={() => onClick?.(category)}
      className="
        min-w-[260px] max-w-[260px]
        bg-white border-2 border-[#E8D9A8] rounded-xl p-4 shadow-sm
        cursor-pointer hover:shadow-md hover:scale-[1.02]
        transition
      "
    >
      <p className="font-semibold text-[#3B2F2F]">{category.name}</p>

      <p className="text-sm text-[#6B5E5E] mb-2">
        ${category.spent.toFixed(2)} of ${category.limitAmount}
      </p>

      <div className="h-2 bg-[#F3EED9] rounded">
        <div
          className="h-2 bg-[#F4B400] rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
