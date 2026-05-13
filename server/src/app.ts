import express = require("express");
import cors = require("cors");
import cookieParser = require("cookie-parser");
import authRoutes = require("./routes/authRoutes");
import activityRoutes = require("./routes/activityRoutes");
import boardRoutes = require("./routes/boardRoutes");
import commentRoutes = require("./routes/commentRoutes");
import taskRoutes = require("./routes/taskRoutes");
import workspaceRoutes = require("./routes/workspaceRoutes");
import errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "LiveTasker API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces", activityRoutes);
app.use("/api", boardRoutes);
app.use("/api", taskRoutes);
app.use("/api", commentRoutes);

app.use(errorHandler);

export = app;
