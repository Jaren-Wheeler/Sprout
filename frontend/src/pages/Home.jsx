import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';

import sproutLogo from '../assets/Logo.png';
import musicFile from '../assets/background-music.mp3';

export default function Home() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef(null);

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
    <div
      className={`sprout-bg flex flex-col items-center justify-center gap-10 relative`}
    >
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
  );
}
