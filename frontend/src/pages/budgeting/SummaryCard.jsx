import React from "react";
import note1 from "../../assets/note1.png";

export default function SummaryCard({ title, value, color }) {
  const tones = {
    income: {
      value: "text-green-700",
    },
    expense: {
      value: "text-rose-700",
    },
    balance: {
      value: "text-sky-700",
    },
  };

  const tone = tones[color] || {
    value: "text-[#3B2F2F]",
  };

  return (
    <div
      className="transition-transform hover:-translate-y-[2px]"
      style={{
        backgroundImage: `url(${note1})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-8 py-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(74,51,32,0.46)]">
            {title}
          </p>
          <h3 className={`mt-3 text-3xl font-bold ${tone.value}`}>
            ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>
    </div>
  );
}
