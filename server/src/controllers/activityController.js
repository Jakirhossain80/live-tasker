"use strict";
const activityLogService = require("../services/activityLogService");
const workspaceService = require("../services/workspaceService");
const asyncHandler = (handler) => {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
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
const parseLimit = (value) => {
    if (value === undefined) {
        return undefined;
    }
    if (Array.isArray(value) || typeof value !== "string") {
        const error = new Error("Activity limit must be a positive integer");
        Object.assign(error, { statusCode: 400 });
        throw error;
    }
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1) {
        const error = new Error("Activity limit must be a positive integer");
        Object.assign(error, { statusCode: 400 });
        throw error;
    }
    return limit;
};
const getWorkspaceActivity = asyncHandler(async (req, res) => {
    const workspaceId = getRouteParam(req, "workspaceId");
    const userId = getAuthUserId(req);
    await workspaceService.getWorkspaceById(workspaceId, userId);
    const activity = await activityLogService.getWorkspaceActivity(workspaceId, parseLimit(req.query.limit));
    res.json({
        success: true,
        data: {
            activity,
        },
    });
});
module.exports = {
    getWorkspaceActivity,
};
//# sourceMappingURL=activityController.js.map