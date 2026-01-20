import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sproutLogo from "../assets/Logo.png";
import musicFile from "../assets/background-music.mp3";

export default function Home() {
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicPlaying) {
      audioRef.current.play().catch(() => {}); // auto-play can fail without interaction
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying]);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  }, []);

  return (
    <div className={`home ${theme}`}>
      {/* Logo */}
      <img
        src={sproutLogo}
        alt="Sprout logo"
        className={`logo pop ${show ? "show delay-1" : ""}`}
      />
      {/* Music toggle */}
      <div className="music-toggle">
        <button onClick={() => setMusicPlaying(!musicPlaying)}>
          {musicPlaying ? "🔊" : "🔇"}
        </button>
      </div>

      <audio ref={audioRef} src={musicFile} loop />

      {/* Actions Row */}
      <div className={`actions-row pop ${show ? "show delay-2" : ""}`}>
        <button
          className="btn signup"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>

        <div className="theme-icons inline">
          <span
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            ☀️
          </span>
          <span
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            🌙
          </span>
        </div>

        <button
          className="btn login"
          onClick={() => navigate("/login")} 
        >
          Log In
        </button>
      </div>
    </div>
  );
}
