"use strict";
const mongoose = require("mongoose");
const ActivityLog = require("../models/ActivityLog");
const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    Object.assign(error, { statusCode });
    return error;
};
const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(`Invalid ${fieldName}`, 400);
    }
};
const logActivity = async ({ workspace, board, task, actor, action, entityType, entityId, message, metadata, }) => {
    const activityData = {
        workspace,
        actor,
        action,
        entityType,
        entityId,
        message,
    };
    if (board !== undefined) {
        activityData.board = board;
    }
    if (task !== undefined) {
        activityData.task = task;
    }
    if (metadata !== undefined) {
        activityData.metadata = metadata;
    }
    return ActivityLog.create(activityData);
};
const logTaskCreated = async ({ workspace, board, task, actor, taskTitle, metadata, }) => {
    return logActivity({
        workspace,
        board,
        task,
        actor,
        action: "created",
        entityType: "task",
        entityId: task,
        message: `Task "${taskTitle}" was created`,
        metadata,
    });
};
const logTaskUpdated = async ({ workspace, board, task, actor, taskTitle, metadata, }) => {
    return logActivity({
        workspace,
        board,
        task,
        actor,
        action: "updated",
        entityType: "task",
        entityId: task,
        message: `Task "${taskTitle}" was updated`,
        metadata,
    });
};
const logTaskMoved = async ({ workspace, board, task, actor, taskTitle, metadata, }) => {
    return logActivity({
        workspace,
        board,
        task,
        actor,
        action: "moved",
        entityType: "task",
        entityId: task,
        message: `Task "${taskTitle}" was moved`,
        metadata,
    });
};
const logCommentAdded = async ({ workspace, board, task, comment, actor, taskTitle, metadata, }) => {
    return logActivity({
        workspace,
        board,
        task,
        actor,
        action: "commented",
        entityType: "comment",
        entityId: comment,
        message: `Comment added to task "${taskTitle}"`,
        metadata,
    });
};
const getWorkspaceActivity = async (workspaceId, limit) => {
    validateObjectId(workspaceId, "workspace id");
    const query = ActivityLog.find({
        workspace: workspaceId,
    })
        .sort({ createdAt: -1 })
        .populate("actor", "name email avatar")
        .populate("board", "name description")
        .populate("task", "title status priority dueDate");
    if (limit !== undefined) {
        query.limit(limit);
    }
    return query.exec();
};
module.exports = {
    logActivity,
    logTaskCreated,
    logTaskUpdated,
    logTaskMoved,
    logCommentAdded,
    getWorkspaceActivity,
};
//# sourceMappingURL=activityLogService.js.map