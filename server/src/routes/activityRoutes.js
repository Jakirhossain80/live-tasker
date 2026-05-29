"use strict";
const express = require("express");
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.use(authMiddleware.protect);
router.get("/:workspaceId/activity", activityController.getWorkspaceActivity);
module.exports = router;
//# sourceMappingURL=activityRoutes.js.map