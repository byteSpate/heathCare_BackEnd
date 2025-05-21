import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: true;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T;
  }
) => {
  const message = jsonData.message;
  res.status(jsonData.statusCode).json({
    success: true,
    message: message,
    meta: jsonData.meta,
    data: jsonData.data,
  });
};
