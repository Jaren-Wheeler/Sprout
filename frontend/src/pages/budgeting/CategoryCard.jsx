import React from 'react';
import note3 from "../../assets/note3.png";

export default function CategoryCard({ category, onClick }) {
  const percent = (category.spent / category.limitAmount) * 100 || 0;

  const isOver = percent > 100;
  const displayPercent = Math.min(percent, 100);

  const randomRotation = React.useMemo(() => (Math.random() * 4 - 2).toFixed(2), []);
  return (
    <div
      onClick={() => onClick?.(category)}
      className={`
        min-w-[260px] max-w-[260px]
        sprout-card p-4 hover:scale-[1.02]
        ${isOver ? 'border-red-400' : ''}
      `}
      style={{
        backgroundImage: `url(${note3})`,
        backgroundSize: "100% 100%", // Ensures the note covers the card area
        backgroundRepeat: "no-repeat",
        padding: "35px 25px", // Extra padding to keep text off the paper edges
        transform: `rotate(${randomRotation}deg)`,
        filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.15))",
        minWidth: "260px"
      }}
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
