import type { NextFunction, Request, RequestHandler, Response } from "express";
import activityLogService = require("../services/activityLogService");
import workspaceService = require("../services/workspaceService");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};

const getAuthUserId = (req: Request) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    const error = new Error("Authentication is required");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  return authReq.user.id;
};

const getRouteParam = (req: Request, paramName: string) => {
  const value = req.params[paramName];

  if (typeof value !== "string") {
    const error = new Error(`${paramName} is required`);
    Object.assign(error, { statusCode: 400 });
    throw error;
  }

  return value;
};

const parseLimit = (value: unknown) => {
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

  const activity = await activityLogService.getWorkspaceActivity(
    workspaceId,
    parseLimit(req.query.limit),
  );

  res.json({
    success: true,
    data: {
      activity,
    },
  });
});

export = {
  getWorkspaceActivity,
};
