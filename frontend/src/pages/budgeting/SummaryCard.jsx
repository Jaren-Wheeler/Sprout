import React from "react";
// Import note2 instead
import note2 from "../../assets/note2.png";

export default function SummaryCard({ title, value, color }) {
  const textColors = {
    income: "text-green-700",
    expense: "text-red-600",
    balance: "text-blue-700",
  };

  const textColor = textColors[color] || "text-[#3B2F2F]";

  // Random rotation for the scrapbook effect
  const randomRotation = React.useMemo(() => (Math.random() * 4 - 2).toFixed(2), []);

  return (
    <div
      className="transition-transform hover:scale-105"
      style={{
        backgroundImage: `url(${note2})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        padding: "45px 35px", // Adjusted padding for note2 shape
        minWidth: "240px",
        transform: `rotate(${randomRotation}deg)`,
        filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.12))",
      }}
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8D7E5D] mb-1">
          {title}
        </p>
        <h3 className={`text-3xl font-bold ${textColor}`}>
          ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}