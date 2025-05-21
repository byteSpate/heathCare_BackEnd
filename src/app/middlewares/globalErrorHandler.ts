import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // let statusCode = status.INTERNAL_SERVER_ERROR;
  // let success = false;
  // let message = err.message || "Something went wrong!";
  // let error = err;

  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err,
  });
};
