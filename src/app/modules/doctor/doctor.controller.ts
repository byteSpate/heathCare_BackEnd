import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";
import { doctorService } from "./doctor.service";
import { doctorFilterAbleSearchFields } from "./doctor.constant";

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = pick(req.query, doctorFilterAbleSearchFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await doctorService.getAllFromDB(query, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Doctor Fetched",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Fetched",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await doctorService.updateIntoDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Update data successfully",
    data: result,
  });
});
export const doctorController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
