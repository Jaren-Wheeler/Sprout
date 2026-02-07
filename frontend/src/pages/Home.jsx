// frontend/src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import sproutLogo from '../assets/Logo.png';
import musicFile from '../assets/background-music.mp3';
import { useTheme } from '../theme/ThemeContext.jsx';

export default function Home() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicPlaying) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [musicPlaying]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`home ${theme}`}>
      <img
        src={sproutLogo}
        alt="Sprout logo"
        className={`logo pop ${show ? 'show delay-1' : ''}`}
      />

      <div className="music-toggle">
        <button onClick={() => setMusicPlaying((p) => !p)}>
          {musicPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      <audio ref={audioRef} src={musicFile} loop />

      <div className={`actions-row pop ${show ? 'show delay-2' : ''}`}>
        <button className="btn signup" onClick={() => navigate('/signup')}>
          Sign Up
        </button>

        <div className="theme-icons inline">
          <span
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
          >
            ☀️
          </span>
          <span
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
          >
            🌙
          </span>
        </div>

        <button className="btn login" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    </div>
  );
}
