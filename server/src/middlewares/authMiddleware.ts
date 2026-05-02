import type { NextFunction, Request, RequestHandler, Response } from "express";
import authService = require("../services/authService");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const protect: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    res.status(401);
    next(new Error("Access token is required"));
    return;
  }

  try {
    const token = authorizationHeader.slice("Bearer ".length).trim();
    const payload = authService.verifyAccessToken(token);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    res.status(401);
    next(new Error("Invalid or expired access token"));
  }
};

export = {
  protect,
};
