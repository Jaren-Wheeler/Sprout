import SproutingAnimation from "./SproutingAnimation.jsx";

export default function Explanation() {
  return (
    <section className="w-full bg-gradient-to-b from-[#e8f4ff] to-[#cfe8ff] flex justify-center pb-48">

      <div className="max-w-7xl w-full px-8 grid md:grid-cols-2 items-center gap-40">

        {/* LEFT SIDE MASCOT */}
        <div className="flex justify-center">
          <SproutingAnimation />
        </div>

        {/* RIGHT SIDE TEXT */}
        <div className="flex flex-col justify-center">

          <h2 className="text-6xl md:text-7xl font-bold text-[#5b2d0b] leading-[1.05] tracking-[-0.02em] font-[Poppins]">
            Make progress and
            <br />
            <span className="text-green-700">grow Sprout's habitat.</span>
          </h2>

          <p className="text-lg text-[#5c3b1a] mt-8 max-w-lg leading-relaxed font-[Inter]">
            Every goal you complete improves your habitat.
            Watch your environment grow and evolve as your
            productivity and habits strengthen.
          </p>

        </div>

      </div>

    </section>
  );
}