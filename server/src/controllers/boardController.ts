import type { NextFunction, Request, RequestHandler, Response } from "express";
import boardService = require("../services/boardService");

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

const validateColumns = (columns: unknown) => {
  if (!Array.isArray(columns)) {
    return "Board columns must be an array";
  }

  if (columns.length === 0) {
    return "Board columns cannot be empty";
  }

  for (const column of columns) {
    if (!column || typeof column !== "object") {
      return "Each board column must be an object";
    }

    const boardColumn = column as { title?: unknown; order?: unknown };

    if (!isStringWithValue(boardColumn.title)) {
      return "Each board column title is required";
    }

    if ((boardColumn.title as string).trim().length > 60) {
      return "Board column title cannot be longer than 60 characters";
    }

    if (
      typeof boardColumn.order !== "number" ||
      !Number.isInteger(boardColumn.order) ||
      boardColumn.order < 0
    ) {
      return "Each board column order must be a non-negative integer";
    }
  }

  return null;
};

const validateCreateBoardBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.name)) {
    return "Board name is required";
  }

  if (body.name.trim().length < 2) {
    return "Board name must be at least 2 characters";
  }

  if (body.name.trim().length > 100) {
    return "Board name cannot be longer than 100 characters";
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    return "Board description must be a string";
  }

  if (typeof body.description === "string" && body.description.length > 500) {
    return "Board description cannot be longer than 500 characters";
  }

  if (body.columns !== undefined) {
    return validateColumns(body.columns);
  }

  return null;
};

const validateUpdateBoardBody = (body: Request["body"]) => {
  const hasName = body.name !== undefined;
  const hasDescription = body.description !== undefined;
  const hasColumns = body.columns !== undefined;
  const hasIsArchived = body.isArchived !== undefined;

  if (!hasName && !hasDescription && !hasColumns && !hasIsArchived) {
    return "At least one board field is required";
  }

  if (hasName && !isStringWithValue(body.name)) {
    return "Board name must not be empty";
  }

  if (hasName && body.name.trim().length < 2) {
    return "Board name must be at least 2 characters";
  }

  if (hasName && body.name.trim().length > 100) {
    return "Board name cannot be longer than 100 characters";
  }

  if (hasDescription && typeof body.description !== "string") {
    return "Board description must be a string";
  }

  if (typeof body.description === "string" && body.description.length > 500) {
    return "Board description cannot be longer than 500 characters";
  }

  if (hasColumns) {
    const columnsError = validateColumns(body.columns);

    if (columnsError) {
      return columnsError;
    }
  }

  if (hasIsArchived && typeof body.isArchived !== "boolean") {
    return "isArchived must be true or false";
  }

  return null;
};

const createBoard = asyncHandler(async (req, res) => {
  const validationError = validateCreateBoardBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const boardData: {
    workspaceId: string;
    userId: string;
    name: string;
    description?: string;
    columns?: { title: string; order: number }[];
  } = {
    workspaceId: getRouteParam(req, "workspaceId"),
    userId: getAuthUserId(req),
    name: req.body.name,
  };

  if (req.body.description !== undefined) {
    boardData.description = req.body.description;
  }

  if (req.body.columns !== undefined) {
    boardData.columns = req.body.columns;
  }

  const board = await boardService.createBoard(boardData);

  res.status(201).json({
    success: true,
    message: "Board created successfully",
    data: {
      board,
    },
  });
});

const getBoardsByWorkspace = asyncHandler(async (req, res) => {
  const boards = await boardService.getBoardsByWorkspace(
    getRouteParam(req, "workspaceId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    data: {
      boards,
    },
  });
});

const getBoardById = asyncHandler(async (req, res) => {
  const board = await boardService.getBoardById(
    getRouteParam(req, "boardId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    data: {
      board,
    },
  });
});

const updateBoard = asyncHandler(async (req, res) => {
  const validationError = validateUpdateBoardBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const updateData: {
    boardId: string;
    userId: string;
    name?: string;
    description?: string;
    columns?: { title: string; order: number }[];
    isArchived?: boolean;
  } = {
    boardId: getRouteParam(req, "boardId"),
    userId: getAuthUserId(req),
  };

  if (req.body.name !== undefined) {
    updateData.name = req.body.name;
  }

  if (req.body.description !== undefined) {
    updateData.description = req.body.description;
  }

  if (req.body.columns !== undefined) {
    updateData.columns = req.body.columns;
  }

  if (req.body.isArchived !== undefined) {
    updateData.isArchived = req.body.isArchived;
  }

  const board = await boardService.updateBoard(updateData);

  res.json({
    success: true,
    message: "Board updated successfully",
    data: {
      board,
    },
  });
});

const deleteBoard = asyncHandler(async (req, res) => {
  await boardService.deleteBoard(
    getRouteParam(req, "boardId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    message: "Board deleted successfully",
  });
});

export = {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
};
