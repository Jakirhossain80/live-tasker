import express = require("express");
import workspaceController = require("../controllers/workspaceController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/", workspaceController.createWorkspace);
router.get("/", workspaceController.getWorkspaces);
router.get("/:workspaceId", workspaceController.getWorkspaceById);
router.patch("/:workspaceId", workspaceController.updateWorkspace);
router.post("/:workspaceId/members", workspaceController.addMember);
router.patch("/:workspaceId/members/:userId", workspaceController.updateMember);
router.delete("/:workspaceId/members/:userId", workspaceController.removeMember);

export = router;
