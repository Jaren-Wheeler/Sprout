import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1115",
        panel: "#161a22",
        border: "#242a38",
        text: "#e5e7eb",
        muted: "#9ca3af",
        accent: "#6366f1",
      },
    },
  },
  plugins: [lineClamp],
};