import { useState, useEffect } from "react";

import sproutImg from "../../assets/askmeanything.png";

const features = [
  {
    title: "Budget Tracking",
    text: "Monitor spending and manage budgets with clear insights.",
    image: sproutImg
  },
  {
    title: "Smart Scheduling",
    text: "Plan events, track deadlines, and organize your day.",
    image: sproutImg
  },
  {
    title: "Notes & Ideas",
    text: "Capture ideas and important information whenever you need it.",
    image: sproutImg
  },
  {
    title: "AI Assistance",
    text: "Get help organizing plans and making smarter decisions.",
    image: sproutImg
  }
];

// clone first slide to allow seamless looping
const slides = [...features, features[0]];

export default function Introduction() {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  const next = () => {
    setIndex((i) => i + 1);
  };

  const prev = () => {
    setIndex((i) => (i - 1 < 0 ? features.length - 1 : i - 1));
  };

  // auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => i + 1);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // handle seamless reset after clone slide
  useEffect(() => {
    if (index === features.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 700); // must match animation duration

      return () => clearTimeout(timeout);
    }
  }, [index]);

  // re-enable transition after reset
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    }
  }, [transition]);

  return (
    <section className="w-full mt-32 bg-indigo-950 py-24 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col items-center gap-12 px-6">

        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mt-12">
          Everything You Need to Stay Organized
        </h2>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden mt-24">

          {/* Sliding track */}
          <div
            className={`flex ${
              transition ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((feature, i) => (
              <div
                key={i}
                className={`min-w-full flex flex-col items-center text-center gap-6 transition-all duration-700 ${
                    i === index ? "scale-100 opacity-100" : "scale-95 opacity-60"
                }`}
              >
                <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-[500px] object-contain animate-sprout-float
                                drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)]
                                transition-transform duration-700"
                />

                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-indigo-200 max-w-md">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2
                        w-12 h-12 flex items-center justify-center
                        rounded-full
                        bg-white/10 backdrop-blur
                        border border-white/20
                        text-white text-2xl
                        shadow-lg
                        transition-all duration-200
                        hover:bg-white/20 hover:scale-110"
            >
            ←
            </button>

            <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2
                        w-12 h-12 flex items-center justify-center
                        rounded-full
                        bg-white/10 backdrop-blur
                        border border-white/20
                        text-white text-2xl
                        shadow-lg
                        transition-all duration-200
                        hover:bg-white/20 hover:scale-110"
            >
            →
            </button>

        </div>

        {/* Dots */}
        <div className="flex gap-3">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-white scale-110" : "bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}