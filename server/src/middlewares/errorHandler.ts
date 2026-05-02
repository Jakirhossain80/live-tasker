import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const errorStatusCode =
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof err.statusCode === "number"
      ? err.statusCode
      : undefined;

  const statusCode = errorStatusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
};

export = errorHandler;
