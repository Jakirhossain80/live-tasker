import express = require("express");
import taskController = require("../controllers/taskController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/boards/:boardId/tasks", taskController.createTask);
router.get("/boards/:boardId/tasks", taskController.getTasksByBoard);
router.get("/tasks/:taskId", taskController.getTaskById);
router.patch("/tasks/:taskId/move", taskController.moveTask);
router.patch("/tasks/:taskId", taskController.updateTask);
router.delete("/tasks/:taskId", taskController.deleteTask);

export = router;
