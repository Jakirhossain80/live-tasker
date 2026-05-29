"use strict";
const commentService = require("../services/commentService");
const asyncHandler = (handler) => {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
};
const isStringWithValue = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};
const getAuthUserId = (req) => {
    const authReq = req;
    if (!authReq.user) {
        const error = new Error("Authentication is required");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    return authReq.user.id;
};
const getRouteParam = (req, paramName) => {
    const value = req.params[paramName];
    if (typeof value !== "string") {
        const error = new Error(`${paramName} is required`);
        Object.assign(error, { statusCode: 400 });
        throw error;
    }
    return value;
};
const validateCommentContent = (content) => {
    if (!isStringWithValue(content)) {
        return "Comment content is required";
    }
    if (content.trim().length > 2000) {
        return "Comment content cannot be longer than 2000 characters";
    }
    return null;
};
const createComment = asyncHandler(async (req, res) => {
    const validationError = validateCommentContent(req.body.content);
    if (validationError) {
        res.status(400);
        throw new Error(validationError);
    }
    const comment = await commentService.createComment({
        taskId: getRouteParam(req, "taskId"),
        userId: getAuthUserId(req),
        content: req.body.content,
    });
    res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: {
            comment,
        },
    });
});
const getCommentsByTask = asyncHandler(async (req, res) => {
    const comments = await commentService.getCommentsByTask(getRouteParam(req, "taskId"), getAuthUserId(req));
    res.json({
        success: true,
        data: {
            comments,
        },
    });
});
const updateComment = asyncHandler(async (req, res) => {
    const validationError = validateCommentContent(req.body.content);
    if (validationError) {
        res.status(400);
        throw new Error(validationError);
    }
    const comment = await commentService.updateComment({
        commentId: getRouteParam(req, "commentId"),
        userId: getAuthUserId(req),
        content: req.body.content,
    });
    res.json({
        success: true,
        message: "Comment updated successfully",
        data: {
            comment,
        },
    });
});
const deleteComment = asyncHandler(async (req, res) => {
    await commentService.deleteComment(getRouteParam(req, "commentId"), getAuthUserId(req));
    res.json({
        success: true,
        message: "Comment deleted successfully",
    });
});
module.exports = {
    createComment,
    getCommentsByTask,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=commentController.js.map