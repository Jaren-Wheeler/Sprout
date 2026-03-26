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
      className="mx-auto flex items-center rounded-full border border-[rgba(76,123,61,0.26)] bg-[linear-gradient(180deg,#79ad63_0%,#5b9247_100%)] px-6 py-3 text-white shadow-[0_18px_32px_rgba(76,123,61,0.24)] transition-all hover:-translate-y-[2px] hover:shadow-[0_22px_40px_rgba(76,123,61,0.28)]"
    >
      <span className="font-semibold tracking-[0.01em]">
        Explore the habitat
      </span>
    </button>
  );
}
