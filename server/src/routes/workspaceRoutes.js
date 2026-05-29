"use strict";
const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.use(authMiddleware.protect);
router.post("/", workspaceController.createWorkspace);
router.get("/", workspaceController.getWorkspaces);
router.get("/:workspaceId", workspaceController.getWorkspaceById);
router.patch("/:workspaceId", workspaceController.updateWorkspace);
router.delete("/:workspaceId", workspaceController.archiveWorkspace);
router.post("/:workspaceId/join", workspaceController.joinWorkspace);
router.post("/:workspaceId/members", workspaceController.addMember);
router.patch("/:workspaceId/members/:userId", workspaceController.updateMember);
router.delete("/:workspaceId/members/:userId", workspaceController.removeMember);
module.exports = router;
//# sourceMappingURL=workspaceRoutes.js.map