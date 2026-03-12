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
    title: "Diet Tracking",
    text: "Log meals, monitor nutrition, and build healthier eating habits.",
    image: sproutImg
  },
  {
    title: "AI Assistance",
    text: "Get help organizing plans and making smarter decisions.",
    image: sproutImg
  }
];

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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => i + 1);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (index === features.length) {
      const timeout = setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    }
  }, [transition]);

  return (
    <section className="relative w-full bg-[#f3eed9] py-36 flex justify-center overflow-hidden min-h-screen">

      <div className="max-w-6xl w-full flex flex-col items-center gap-16 px-6">

        {/* Title */}
        <h2 className="text-6xl md:text-7xl font-bold text-[#5b2d0b] text-center leading-[1.05] tracking-[-0.02em] font-[Poppins]">
          Explore
          <span className="text-green-700"> Features</span>
        </h2>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden pt-16">

          {/* Sliding Track */}
          <div
            className={`flex ${
              transition ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((feature, i) => (
              <div
                key={i}
                className={`min-w-full flex flex-col items-center text-center gap-8 transition-all duration-700 ${
                  i === index
                    ? "scale-100 opacity-100"
                    : "scale-[0.94] opacity-50"
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-[420px] object-contain animate-sprout-float
                             drop-shadow-[0_35px_70px_rgba(0,0,0,0.25)]
                             transition-transform duration-700"
                />

                <h3 className="text-4xl font-semibold text-[#5b2d0b] font-[Poppins] tracking-tight">
                  {feature.title}
                </h3>

                <p className="text-lg text-[#5c3b1a] max-w-lg leading-relaxed font-[Inter]">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Carousel Dots */}
        <div className="flex gap-3 mt-4">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-[#5b2d0b] scale-110"
                  : "bg-[#5b2d0b]/30 hover:bg-[#5b2d0b]/50"
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}