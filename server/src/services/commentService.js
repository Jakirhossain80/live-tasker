"use strict";
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const activityLogService = require("./activityLogService");
const socketEmitter = require("../sockets/socketEmitter");
const createHttpError = (message, statusCode, errorCode) => {
    const error = new Error(message);
    Object.assign(error, { statusCode, errorCode });
    return error;
};
const validateObjectId = (id, fieldName, errorCode = "INVALID_OBJECT_ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(`Invalid ${fieldName}`, 400, errorCode);
    }
};
const getMember = (workspace, userId) => {
    return workspace.members.find((member) => String(member.user) === userId);
};
const ensureWorkspaceMember = (workspace, userId) => {
    const member = getMember(workspace, userId);
    if (!member) {
        throw createHttpError("User is not a member of this workspace", 403, "WORKSPACE_MEMBERSHIP_REQUIRED");
    }
    return member;
};
const getTaskForMember = async (taskId, userId) => {
    validateObjectId(taskId, "task id");
    const task = await Task.findById(taskId);
    if (!task) {
        throw createHttpError("Task not found", 404, "TASK_NOT_FOUND");
    }
    const workspace = await Workspace.findById(task.workspace);
    if (!workspace) {
        throw createHttpError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
    }
    const member = ensureWorkspaceMember(workspace, userId);
    return { task, workspace, member };
};
const getCommentForMember = async (commentId, userId) => {
    validateObjectId(commentId, "comment id");
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw createHttpError("Comment not found", 404, "COMMENT_NOT_FOUND");
    }
    const { workspace, member } = await getTaskForMember(String(comment.task), userId);
    return { comment, workspace, member };
};
const populateComment = (query) => {
    return query
        .populate("task", "title status board workspace")
        .populate("author", "name email avatar");
};
const createComment = async ({ taskId, userId, content, }) => {
    const { task } = await getTaskForMember(taskId, userId);
    const comment = await Comment.create({
        task: task._id,
        author: userId,
        content: content.trim(),
    });
    await activityLogService.logCommentAdded({
        workspace: task.workspace,
        board: task.board,
        task: task._id,
        comment: comment._id,
        actor: userId,
        taskTitle: task.title,
        metadata: {
            commentPreview: comment.content.slice(0, 120),
        },
    });
    const populatedComment = await populateComment(Comment.findById(comment._id));
    socketEmitter.emitCommentAdded(populatedComment);
    return populatedComment;
};
const getCommentsByTask = async (taskId, userId) => {
    await getTaskForMember(taskId, userId);
    return populateComment(Comment.find({
        task: taskId,
    }).sort({ createdAt: -1 }));
};
const updateComment = async ({ commentId, userId, content, }) => {
    const { comment } = await getCommentForMember(commentId, userId);
    if (String(comment.author) !== userId) {
        throw createHttpError("Only the comment author can edit this comment", 403, "COMMENT_UPDATE_FORBIDDEN");
    }
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();
    return populateComment(Comment.findById(comment._id));
};
const deleteComment = async (commentId, userId) => {
    const { comment } = await getCommentForMember(commentId, userId);
    if (String(comment.author) !== userId) {
        throw createHttpError("Only the comment author can delete this comment", 403, "COMMENT_DELETE_FORBIDDEN");
    }
    await Comment.findByIdAndDelete(comment._id);
};
module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=commentService.js.map