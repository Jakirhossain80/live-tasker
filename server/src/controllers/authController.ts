import type { NextFunction, Request, RequestHandler, Response } from "express";
import authService = require("../services/authService");

const isProduction = process.env.NODE_ENV === "production";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const refreshCookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

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

const validateRegisterBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.name)) {
    return "Name is required";
  }

  if (!isStringWithValue(body.email)) {
    return "Email is required";
  }

  if (!isStringWithValue(body.password)) {
    return "Password is required";
  }

  if (body.password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
};

const validateLoginBody = (body: Request["body"]) => {
  if (!isStringWithValue(body.email)) {
    return "Email is required";
  }

  if (!isStringWithValue(body.password)) {
    return "Password is required";
  }

  return null;
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(
    authService.refreshTokenCookieName,
    refreshToken,
    {
      ...refreshCookieBaseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  );
};

const register = asyncHandler(async (req, res) => {
  const validationError = validateRegisterBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const result = await authService.register({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const validationError = validateLoginBody(req.body);

  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const result = await authService.login({
    email: req.body.email,
    password: req.body.password,
  });

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(
    req.cookies[authService.refreshTokenCookieName],
  );

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(
    authService.refreshTokenCookieName,
    refreshCookieBaseOptions,
  );

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

const me = asyncHandler(async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401);
    throw new Error("Authentication is required");
  }

  const user = await authService.getMe(authReq.user.id);

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

export = {
  register,
  login,
  refresh,
  logout,
  me,
};
