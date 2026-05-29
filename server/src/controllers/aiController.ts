import type { NextFunction, Request, RequestHandler, Response } from "express";
import aiService = require("../services/aiService");

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

const validateGenerateDescriptionBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.title)) {
    return "Task title is required";
  }

  if (body.title.trim().length > 200) {
    return "Task title cannot be longer than 200 characters";
  }

  return null;
};

const generateDescription = asyncHandler(async (req, res) => {
  const validationError = validateGenerateDescriptionBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const description = await aiService.generateTaskDescription(req.body.title);

  res.json({
    success: true,
    description,
  });
});

export = {
  generateDescription,
};
