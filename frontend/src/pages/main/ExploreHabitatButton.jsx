import React from "react";
import { useNavigate } from "react-router-dom";

export default function ExploreHabitatButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/habitat");
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full border border-[rgba(76,123,61,0.26)] bg-[linear-gradient(180deg,#79ad63_0%,#5b9247_100%)] px-5 py-3 text-white shadow-[0_18px_32px_rgba(76,123,61,0.24)] transition-all hover:-translate-y-[2px] hover:shadow-[0_22px_40px_rgba(76,123,61,0.28)]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/18 text-lg">
        Go
      </span>
      <span className="font-semibold tracking-[0.01em]">
        Explore the habitat
      </span>
    </button>
  );
}
