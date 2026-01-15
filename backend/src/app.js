const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/Auth.routes");
const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/User.routes");
const schedulerRoutes = require("./routes/scheduler.routes");
const notesRoutes = require("./routes/notes.routes");
const financeRoutes = require("./routes/finance.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/finances", financeRoutes);

module.exports = app;
