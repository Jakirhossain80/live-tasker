"use strict";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const boardRoutes = require("./routes/boardRoutes");
const commentRoutes = require("./routes/commentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "LiveTasker API is running",
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces", activityRoutes);
app.use("/api", boardRoutes);
app.use("/api", taskRoutes);
app.use("/api", commentRoutes);
app.use(errorHandler);
module.exports = app;
//# sourceMappingURL=app.js.map