import React from "react";
import { Link , useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";


export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: "url(src/assets/forest.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <img
        src="src/assets/settings.png"
        alt="settings"
        style={{ position: "absolute", left: 180, top: 150, cursor: "pointer", width: 180 }}
        onClick={() => navigate("/settings")}
      />

      <img
        src="src/assets/scheduler.png"
        alt="scheduler"
        style={{ position: "absolute", left: 100, top: 430, cursor: "pointer", width: 900 }}
        onClick={() => navigate("/scheduler")}
      />

      <img
        src="src/assets/expenses.png"
        alt="expenses"
        style={{ position: "absolute", left: 900, top: 550, cursor: "pointer", width: 180 }}
        onClick={() => navigate("expenses")}
      />

      <img
        src="src/assets/notes.png"
        alt="notes"
        style={{ position: "absolute", right: 300, top: 500, cursor: "pointer", width: 550 }}
        onClick={() => navigate("notes")}
      />

      <img
        src="src/assets/fitness.png"
        alt="fitness"
        style={{ position: "absolute", right: 320, top: 180, cursor: "pointer", width: 200 }}
        onClick={() => navigate("/fitness")}
      />

      <img
        src="src/assets/askmeanything.png"
        alt="askmeanything"
        style={{ position: "absolute", right: 50, bottom: 50, cursor: "pointer", width: 200 }}
        onClick={() => navigate("/chatbot")}
      />

      <img
        src="src/assets/lightdark.png"
        alt="lightdark"
        style={{ position: "absolute", left: "50%", top: 20, transform: "translateX(-50%)", cursor: "pointer", width: 200 }}
        onClick={() => console.log("toggle theme")}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 80,
          background: "#4a2929",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
          fontWeight: "bold",
          color: "yellow",
        }}
      >
        FOOTER HERE
      </div>
    </div>
  );
}
