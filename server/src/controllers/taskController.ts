import type { NextFunction, Request, RequestHandler, Response } from "express";
import taskService = require("../services/taskService");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const taskPriorities = ["low", "medium", "high", "urgent"];

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

const isValidDateValue = (value: unknown) => {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
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

const validateAssignees = (assignees: unknown) => {
  if (!Array.isArray(assignees)) {
    return "Task assignees must be an array";
  }

  if (!assignees.every((assignee) => isStringWithValue(assignee))) {
    return "Each task assignee must be a user id";
  }

  return null;
};

const validateLabels = (labels: unknown) => {
  if (!Array.isArray(labels)) {
    return "Task labels must be an array";
  }

  for (const label of labels) {
    if (typeof label !== "string") {
      return "Each task label must be a string";
    }

    if (label.trim().length > 50) {
      return "Task labels cannot be longer than 50 characters";
    }
  }

  return null;
};

const validateCommonTaskFields = (body: Request["body"]) => {
  if (body.description !== undefined && typeof body.description !== "string") {
    return "Task description must be a string";
  }

  if (typeof body.description === "string" && body.description.length > 5000) {
    return "Task description cannot be longer than 5000 characters";
  }

  if (body.assignees !== undefined) {
    const assigneesError = validateAssignees(body.assignees);

    if (assigneesError) {
      return assigneesError;
    }
  }

  if (
    body.priority !== undefined &&
    (typeof body.priority !== "string" || !taskPriorities.includes(body.priority))
  ) {
    return "Task priority must be low, medium, high, or urgent";
  }

  if (
    body.dueDate !== undefined &&
    body.dueDate !== null &&
    !isValidDateValue(body.dueDate)
  ) {
    return "Task dueDate must be a valid date";
  }

  if (body.labels !== undefined) {
    const labelsError = validateLabels(body.labels);

    if (labelsError) {
      return labelsError;
    }
  }

  if (
    body.order !== undefined &&
    (typeof body.order !== "number" ||
      !Number.isInteger(body.order) ||
      body.order < 0)
  ) {
    return "Task order must be a non-negative integer";
  }

  return null;
};

const validateCreateTaskBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.status)) {
    return "Task status is required";
  }

  if (!isStringWithValue(body.title)) {
    return "Task title is required";
  }

  if (body.title.trim().length > 200) {
    return "Task title cannot be longer than 200 characters";
  }

  return validateCommonTaskFields(body);
};

const validateUpdateTaskBody = (body: Request["body"]) => {
  const allowedFields = [
    "status",
    "title",
    "description",
    "assignees",
    "priority",
    "dueDate",
    "labels",
    "order",
  ];

  if (!allowedFields.some((field) => body[field] !== undefined)) {
    return "At least one task field is required";
  }

  if (body.status !== undefined && !isStringWithValue(body.status)) {
    return "Task status must not be empty";
  }

  if (body.title !== undefined && !isStringWithValue(body.title)) {
    return "Task title must not be empty";
  }

  if (typeof body.title === "string" && body.title.trim().length > 200) {
    return "Task title cannot be longer than 200 characters";
  }

  const commonFieldsError = validateCommonTaskFields(body);

  if (commonFieldsError) {
    return commonFieldsError;
  }

  return null;
};

const validateMoveTaskBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.status)) {
    return "Task status is required";
  }

  if (
    typeof body.order !== "number" ||
    !Number.isInteger(body.order) ||
    body.order < 0
  ) {
    return "Task order must be a non-negative integer";
  }

  return null;
};

const createTask = asyncHandler(async (req, res) => {
  const validationError = validateCreateTaskBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const task = await taskService.createTask({
    boardId: getRouteParam(req, "boardId"),
    userId: getAuthUserId(req),
    status: req.body.status,
    title: req.body.title,
    description: req.body.description,
    assignees: req.body.assignees,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    labels: req.body.labels,
    order: req.body.order,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: {
      task,
    },
  });
});

const getTasksByBoard = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByBoard(
    getRouteParam(req, "boardId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    data: {
      tasks,
    },
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    getRouteParam(req, "taskId"),
    getAuthUserId(req),
  );

  res.json({
    success: true,
    data: {
      task,
    },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const validationError = validateUpdateTaskBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const task = await taskService.updateTask({
    taskId: getRouteParam(req, "taskId"),
    userId: getAuthUserId(req),
    status: req.body.status,
    title: req.body.title,
    description: req.body.description,
    assignees: req.body.assignees,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    labels: req.body.labels,
    order: req.body.order,
  });

  res.json({
    success: true,
    message: "Task updated successfully",
    data: {
      task,
    },
  });
});

const moveTask = asyncHandler(async (req, res) => {
  const validationError = validateMoveTaskBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const task = await taskService.moveTask({
    taskId: getRouteParam(req, "taskId"),
    userId: getAuthUserId(req),
    status: req.body.status,
    order: req.body.order,
  });

  res.json({
    success: true,
    message: "Task moved successfully",
    data: {
      task,
    },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(getRouteParam(req, "taskId"), getAuthUserId(req));

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

export = {
  createTask,
  getTasksByBoard,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
};
