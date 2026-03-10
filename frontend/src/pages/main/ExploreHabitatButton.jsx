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
      className="
        fixed bottom-6 right-6
        flex items-center gap-2
        px-5 py-3
        bg-green-500 text-white
        rounded-full
        shadow-lg
        hover:bg-green-600
        transition
      "
    >

      <span className="text-lg">⬇</span>

      <span className="font-semibold">
        Explore the habitat
      </span>

    </button>
  );
}