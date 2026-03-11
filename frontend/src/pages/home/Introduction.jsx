import sproutImg from "../../assets/askmeanything.png";

export default function Introduction() {
  return (
    <section className="w-full bg-[#cfe8ff] py-32 flex justify-center pb-48 pt-48">
      <div className="max-w-7xl w-full px-8 grid md:grid-cols-2 items-center gap-48">

        {/* LEFT SIDE TEXT */}
        <div className="flex flex-col justify-center pr-12">
          <h2 className="text-5xl md:text-7xl font-bold text-amber-900 leading-tight">
            The app that
            <br />
            grows with you.
          </h2>

          <p className="text-xl text-amber-800 mt-6 max-w-xl">
            Organize your budgets, plans, notes, and ideas in one place.
            Sprout helps you stay focused, build better habits, and grow your productivity every day.
          </p>
        </div>

        {/* RIGHT SIDE ANIMATION */}
        <div className="flex justify-center pl-12">
          <img
            src={sproutImg}
            alt="Sprout assistant"
            className="w-[380px] animate-sprout-float drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          />
        </div>

      </div>
    </section>
  );
}