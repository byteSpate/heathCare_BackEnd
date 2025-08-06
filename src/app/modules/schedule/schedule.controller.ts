import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";
import { scheduleServices } from "./schedule.service";
import { IAuthUser } from "../../interfaces/common";
import { doctorScheduleServices } from "../doctorSchedule/doctorSchedule.service";

const createIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await scheduleServices.createIntoDB(payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule Created Successfully",
      data: result,
    });
  }
);
const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request & {user?:IAuthUser}, res: Response) => {
    const user = req?.user;
    const query = pick(req.query, ["startDate","endDate"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await scheduleServices.getAllFromDB(query, options,user as IAuthUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule Fetched Successfully",
      data: result,
    });
  }
);


const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Fetched",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await scheduleServices.deleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Schedule deleted successfully',
        data: result,
    });
});

export const scheduleController = {
  createIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB
};
