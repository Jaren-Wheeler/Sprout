const express = require("express");
const cors = require("cors");

const app = express();

const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/User.routes");
const schedulerRoutes = require("./routes/scheduler.routes");
const notesRoutes = require("./routes/notes.routes");
const financeRoutes = require("./routes/finance.routes");

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", schedulerRoutes);
app.use("/api", notesRoutes);
app.use("/api", financeRoutes);

module.exports = app;
