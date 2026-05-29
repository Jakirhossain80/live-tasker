"use strict";
const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.use(authMiddleware.protect);
router.post("/tasks/:taskId/comments", commentController.createComment);
router.get("/tasks/:taskId/comments", commentController.getCommentsByTask);
router.patch("/comments/:commentId", commentController.updateComment);
router.delete("/comments/:commentId", commentController.deleteComment);
module.exports = router;
//# sourceMappingURL=commentRoutes.js.map