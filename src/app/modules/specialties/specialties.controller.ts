import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { specialtiesServices } from "./specialties.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.insertIntoDB(req);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Specialties inserted successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.getAllFromDB();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtiesServices.deleteById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Specialties delete successfully",
    data: result,
  });
});

export const specialtiesController = {
  insertIntoDB,
  getAllFromDB,
  deleteById,
};
