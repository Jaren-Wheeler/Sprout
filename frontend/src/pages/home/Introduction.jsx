import sproutImg from "../../assets/askmeanything.png";

export default function Introduction() {
  return (
    <section className="w-full bg-gradient-to-b from-[#cfe8ff] to-[#e8f4ff] flex justify-center py-48">

      <div className="max-w-7xl w-full px-8 grid md:grid-cols-2 items-center gap-40">

        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col justify-center">

          <h2 className="text-6xl md:text-7xl font-bold text-[#5b2d0b] leading-[1.05] tracking-[-0.02em] font-[Poppins]">
            The app that
            <br />
            <span className="text-green-700">grows with you.</span>
          </h2>

          <p className="text-lg text-[#5c3b1a] mt-8 max-w-lg leading-relaxed font-[Inter]">
            Organize your budgets, plans, notes, and ideas in one place.
            Sprout helps you stay focused, build better habits, and grow
            your productivity every day.
          </p>

          {/* CTA */}
          <button className="mt-10 w-fit px-8 py-4 bg-green-600 text-white font-semibold font-[Inter] rounded-xl shadow-lg hover:bg-green-700 hover:-translate-y-1 transition-all duration-200">
            Start Growing
          </button>

        </div>

        {/* RIGHT SIDE MASCOT */}
        <div className="flex justify-center">
          <img
            src={sproutImg}
            alt="Sprout assistant"
            className="w-[340px] animate-sprout-float drop-shadow-[0_35px_70px_rgba(0,0,0,0.25)]"
          />
        </div>

      </div>

    </section>
  );
}