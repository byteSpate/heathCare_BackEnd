import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilteredAbleFields } from "./admin.constant";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = pick(req.query, adminFilteredAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await adminServices.getAllFromDB(query, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Admin Fetched",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin Fetched",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await adminServices.updateIntoDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Update data successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminServices.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});
export const adminControllers = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
