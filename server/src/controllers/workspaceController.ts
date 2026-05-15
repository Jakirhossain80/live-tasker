import type { NextFunction, Request, RequestHandler, Response } from "express";
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

const isStringWithValue = (value: unknown) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidMemberRole = (value: unknown) => {
  return value === "admin" || value === "member";
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

const validateCreateWorkspaceBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.name)) {
    return "Workspace name is required";
  }

  if (body.name.trim().length < 2) {
    return "Workspace name must be at least 2 characters";
  }

  if (body.name.trim().length > 100) {
    return "Workspace name cannot be longer than 100 characters";
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    return "Workspace description must be a string";
  }

  if (typeof body.description === "string" && body.description.length > 500) {
    return "Workspace description cannot be longer than 500 characters";
  }

  return null;
};

const validateUpdateWorkspaceBody = (body: Request["body"]) => {
  const hasName = body.name !== undefined;
  const hasDescription = body.description !== undefined;
  const hasIsArchived = body.isArchived !== undefined;

  if (!hasName && !hasDescription && !hasIsArchived) {
    return "At least one workspace field is required";
  }

  if (hasName && !isStringWithValue(body.name)) {
    return "Workspace name must not be empty";
  }

  if (hasName && body.name.trim().length < 2) {
    return "Workspace name must be at least 2 characters";
  }

  if (hasName && body.name.trim().length > 100) {
    return "Workspace name cannot be longer than 100 characters";
  }

  if (hasDescription && typeof body.description !== "string") {
    return "Workspace description must be a string";
  }

  if (typeof body.description === "string" && body.description.length > 500) {
    return "Workspace description cannot be longer than 500 characters";
  }

  if (hasIsArchived && typeof body.isArchived !== "boolean") {
    return "isArchived must be true or false";
  }

  return null;
};

const validateMemberBody = (body: Request["body"]) => {
  const hasUserId = isStringWithValue(body.userId);
  const hasEmail = isStringWithValue(body.email);

  if (!hasUserId && !hasEmail) {
    return "User id or email is required";
  }

  if (hasUserId && hasEmail) {
    return "Provide either user id or email, not both";
  }

  if (body.role !== undefined && !isValidMemberRole(body.role)) {
    return "Role must be admin or member";
  }

  return null;
};

const validateUpdateMemberBody = (body: Request["body"]) => {
  if (!isValidMemberRole(body.role)) {
    return "Role must be admin or member";
  }

  return null;
};

const createWorkspace = asyncHandler(async (req, res) => {
  const validationError = validateCreateWorkspaceBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const workspaceData: {
    name: string;
    ownerId: string;
    description?: string;
  } = {
    name: req.body.name,
    ownerId: getAuthUserId(req),
  };

  if (req.body.description !== undefined) {
    workspaceData.description = req.body.description;
  }

  const workspace = await workspaceService.createWorkspace(workspaceData);

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    data: {
      workspace,
    },
  });
});

const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.getWorkspaces(getAuthUserId(req));

  res.json({
    success: true,
    data: {
      workspaces,
    },
  });
});

const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.getWorkspaceById(
    getRouteParam(req, "workspaceId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    data: {
      workspace,
    },
  });
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const validationError = validateUpdateWorkspaceBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const updateData: {
    workspaceId: string;
    userId: string;
    name?: string;
    description?: string;
    isArchived?: boolean;
  } = {
    workspaceId: getRouteParam(req, "workspaceId"),
    userId: getAuthUserId(req),
  };

  if (req.body.name !== undefined) {
    updateData.name = req.body.name;
  }

  if (req.body.description !== undefined) {
    updateData.description = req.body.description;
  }

  if (req.body.isArchived !== undefined) {
    updateData.isArchived = req.body.isArchived;
  }

  const workspace = await workspaceService.updateWorkspace(updateData);

  res.json({
    success: true,
    message: "Workspace updated successfully",
    data: {
      workspace,
    },
  });
});

const addMember = asyncHandler(async (req, res) => {
  const validationError = validateMemberBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const workspace = await workspaceService.addMember({
    workspaceId: getRouteParam(req, "workspaceId"),
    actorId: getAuthUserId(req),
    userId: req.body.userId,
    email: req.body.email,
    role: req.body.role || "member",
  });

  res.status(201).json({
    success: true,
    message: "Workspace member added successfully",
    data: {
      workspace,
    },
  });
});

const updateMember = asyncHandler(async (req, res) => {
  const validationError = validateUpdateMemberBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const workspace = await workspaceService.updateMember({
    workspaceId: getRouteParam(req, "workspaceId"),
    actorId: getAuthUserId(req),
    userId: getRouteParam(req, "userId"),
    role: req.body.role,
  });

  res.json({
    success: true,
    message: "Workspace member updated successfully",
    data: {
      workspace,
    },
  });
});

const removeMember = asyncHandler(async (req, res) => {
  await workspaceService.removeMember({
    workspaceId: getRouteParam(req, "workspaceId"),
    actorId: getAuthUserId(req),
    userId: getRouteParam(req, "userId"),
  });

  res.json({
    success: true,
    message: "Workspace member removed successfully",
  });
});

export = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  updateMember,
  removeMember,
};
