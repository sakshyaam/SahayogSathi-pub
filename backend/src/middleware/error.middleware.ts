import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global error handler middleware.
 * Catches all errors passed via next(err) and returns a consistent JSON response.
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: null,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: [],
      data: null,
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate entry. This record already exists.",
      errors: [],
      data: null,
    });
    return;
  }

  // Fallback for unexpected errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
    data: null,
  });
};
