import express = require("express");
import activityController = require("../controllers/activityController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/:workspaceId/activity", activityController.getWorkspaceActivity);

export = router;
