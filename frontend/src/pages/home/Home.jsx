import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext.jsx';

import sproutLogo from '../../assets/Logo.png';
import musicFile from '../../assets/background-music.mp3';
import Introduction from "./Introduction.jsx"
import FeatureIntro from './FeatureIntro.jsx';
import Explanation from './Explanation.jsx';
import HomeNav from './HomeNav.jsx';

export default function Home() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 120); // threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    musicPlaying
      ? audioRef.current?.play().catch(() => {})
      : audioRef.current?.pause();
  }, [musicPlaying]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

   return (
    <>
      <HomeNav showNav={showNav} />

      {/* HERO SECTION */}
     <div className="sprout-bg flex flex-col items-center justify-center gap-10 relative min-h-screen">

        {/* Fade clouds into sky */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#cfe8ff] pointer-events-none"></div>

        {/* Logo */}
        <img
          src={sproutLogo}
          alt="Sprout logo"
          className={`w-[min(1400px,95vw)] max-h-[60vh] object-contain drop-shadow-[0_30px_12px_rgba(0,0,0,0.75)]
          pop ${show ? 'show delay-1' : ''}`}
        />

        {/* Music Toggle */}
        <div className="absolute top-6 right-6">
          <button
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 text-xl"
            onClick={() => setMusicPlaying((p) => !p)}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        </div>

        <audio ref={audioRef} src={musicFile} loop />

        {/* Actions */}
        <div
          className={`flex items-center justify-center gap-10 flex-wrap pop ${show ? 'show delay-2' : ''}`}
        >
          <button
            className="sprout-btn signup"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>

          <div className="flex gap-6 text-3xl">
            <span
              className={`cursor-pointer transition ${theme === 'light' ? 'scale-125 opacity-100' : 'opacity-50'}`}
              onClick={() => setTheme('light')}
            >
              ☀️
            </span>

            <span
              className={`cursor-pointer transition ${theme === 'dark' ? 'scale-125 opacity-100' : 'opacity-50'}`}
              onClick={() => setTheme('dark')}
            >
              🌙
            </span>
          </div>

          <button className="sprout-btn login" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>

      </div>

      <Introduction />
      <Explanation />
      {/* INTRODUCTION SECTION */}
      <FeatureIntro/>
    
    </>
  );
}
