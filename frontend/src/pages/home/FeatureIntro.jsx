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

// clone first slide for seamless infinite carousel
const slides = [...features, features[0]];

export default function FeatureIntro() {
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

  // reset position after cloned slide
  useEffect(() => {
    if (index === features.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  // re-enable animation after reset
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    }
  }, [transition]);

  return (
    <section className="relative w-full bg-[#f3eed9] py-24 flex justify-center overflow-hidden min-h-screen">
      
      <div className="max-w-5xl w-full flex flex-col items-center gap-12 px-6">

        {/* Title */}
        <h2 className="text-6xl font-bold text-amber-900 text-center mt-12">
          Explore Features
        </h2>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden pt-24">

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

                <h3 className="text-4xl font-semibold text-amber-900">
                  {feature.title}
                </h3>

                <p className="text-xl text-amber-800 max-w-md">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Carousel Dots */}
        <div className="flex gap-3">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-amber-900 scale-110" : "bg-amber-400/50"
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}