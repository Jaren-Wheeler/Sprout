import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext.jsx';

import sproutLogo from '../../assets/Logo.png';

import { Moon, Sun } from 'lucide-react';
import Explanation from './Explanation.jsx';
import FeatureIntro from './FeatureIntro.jsx';
import Footer from './Footer.jsx';
import HomeNav from './HomeNav.jsx';
import Introduction from './Introduction.jsx';

export default function Home() {
  const { theme, setTheme } = useTheme();

  const [show, setShow] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const introRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setShowNav(scrollY > 120);
      setShowControls(scrollY < 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  const scrollToIntro = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HomeNav showNav={showNav} />

      <section className="sprout-bg relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 pointer-events-none" />

        {/* soft ambient glow */}
        <div className="absolute w-[600px] h-[600px] bg-yellow-200/10 blur-[140px] rounded-full" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[720px] px-6">
          {/* LOGO */}
          <img
            src={sproutLogo}
            alt="Sprout logo"
            className={`w-[min(1000px,90vw)] max-h-[46vh] object-contain
            drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]
            transition-all duration-700 hover:scale-[1.02]
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          />

          {/* TEXT GROUP */}
          <div className="-mt-4 px-6 py-4 rounded-xl bg-black/20 ackdrop-blur-sm">
            <p className="font-[Poppins] text-green-500 text-2xl md:text-3xl font-semibold">
              Grow Higher. The Sky's the Limit.
            </p>

            <p className="font-[Inter] text-white/90 text-lg md:text-xl mt-4 leading-relaxed">
              Organize your life with budgeting, notes, scheduling and daily
              tracking, all in one place.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToIntro}
            className={`mt-10 px-8 py-3 rounded-full font-semibold
            text-white text-sm tracking-wide
            bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500
            shadow-lg hover:shadow-xl
            hover:scale-[1.03] active:scale-[0.98]
            transition-all duration-300
            ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            Explore
          </button>

          {/* SCROLL INDICATOR */}
          <div
            onClick={scrollToIntro}
            className={`mt-6 text-white/80 cursor-pointer transition-opacity duration-500 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="text-3xl animate-bounce">↓</div>
          </div>
        </div>

        {/* THEME TOGGLE */}
        <div
          className={`fixed bottom-8 right-8 transition-opacity duration-500 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white/20 scale-110 text-yellow-400'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Sun size={20} />
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white/20 scale-110 text-blue-400'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Moon size={20} />
            </button>
          </div>
        </div>
      </section>

      <div ref={introRef}>
        <Introduction />
      </div>

      <Explanation />

      <FeatureIntro />
      <Footer />
    </>
  );
}
