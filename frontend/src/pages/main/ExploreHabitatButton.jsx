import React from "react";

export default function ExploreHabitatButton() {

  function handleClick() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }

  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-6 right-6
        flex items-center gap-2
        px-5 py-3
        mt-5
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