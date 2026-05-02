import type { ErrorRequestHandler } from "express";

const getErrorCode = (err: unknown, statusCode: number) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "errorCode" in err &&
    typeof err.errorCode === "string"
  ) {
    return err.errorCode;
  }

  if (statusCode === 400) {
    return "BAD_REQUEST";
  }

  if (statusCode === 401) {
    return "UNAUTHORIZED";
  }

  if (statusCode === 403) {
    return "FORBIDDEN";
  }

  if (statusCode === 404) {
    return "NOT_FOUND";
  }

  if (statusCode === 409) {
    return "CONFLICT";
  }

  return "INTERNAL_SERVER_ERROR";
};

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
    errorCode: getErrorCode(err, statusCode),
  });
};

export = errorHandler;
