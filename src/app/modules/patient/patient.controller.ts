import { patientSearchAbleFields } from "./patient.constant";
import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";
import { patientServices } from "./patient.service";

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = pick(req.query, patientSearchAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await patientServices.getAllFromDB(query, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Patients Fetched",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Fetched",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await patientServices.updateIntoDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Update data successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientServices.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete data successfully",
    data: result,
  });
});

export const patientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
