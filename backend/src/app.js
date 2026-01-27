const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");
const schedulerRoutes = require("./routes/scheduler.routes");
const notesRoutes = require("./routes/notes.routes");
const financeRoutes = require("./routes/finance.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const authRoutes = require("./routes/auth.routes");

const { chatRateLimiter } = require("./middleware/rateLimits");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ----- SESSION MIDDLEWARE ----- //
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false
}));

// ----- OTHER MIDDLEWARE ------ //
app.use(chatRateLimiter);

// ----- API ROUTES ------ //
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;
