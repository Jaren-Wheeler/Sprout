import sproutImg from "../../assets/askmeanything.png";

export default function Explanation() {
  return (
    <section className="w-full bg-[#cfe8ff] flex justify-center pb-48">
      <div className="max-w-7xl w-full px-8 grid md:grid-cols-[1fr_2fr] items-center gap-48">

        {/* RIGHT SIDE ANIMATION */}
        <div className="flex justify-center pr-12">
          <img
            src={sproutImg}
            alt="Sprout assistant"
            className="w-[380px] animate-sprout-float drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col justify-center pl-12">
          <h2 className="text-5xl md:text-7xl font-bold text-amber-900 leading-tight">
            Make progress and grow Sprout's Habitat.
          </h2>

          <p className="text-xl text-amber-800 mt-6 max-w-xl">
            The more you accomplish, the better the habitat.
          </p>
        </div>

        

      </div>
    </section>
  );
}