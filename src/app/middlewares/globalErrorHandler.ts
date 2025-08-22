
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  // if(err instanceof Prisma,)


  res.status(statusCode).json({
    success,
    message,
    error,
  });
};
