import express = require("express");
import boardController = require("../controllers/boardController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/workspaces/:workspaceId/boards", boardController.createBoard);
router.get("/workspaces/:workspaceId/boards", boardController.getBoardsByWorkspace);
router.get("/boards/:boardId", boardController.getBoardById);
router.patch("/boards/:boardId", boardController.updateBoard);
router.delete("/boards/:boardId", boardController.deleteBoard);

export = router;
