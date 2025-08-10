import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { doctorScheduleServices } from "./doctorSchedule.service";
import pick from "../../../shared/pick";

const createIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const result = await doctorScheduleServices.createIntoDB(user, payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule Created Successfully",
      data: result,
    });
  }
);

const getMySchedule: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;
    const query = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await doctorScheduleServices.getMySchedule(
      query,
      options,
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Schedule Fetched Successfully",
      data: result,
    });
  }
);

const deleteFromDB: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;
    const {id} = req.params; 
    const result = await doctorScheduleServices.deleteFromDB(
      user as IAuthUser,
      id
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Schedule Deleted Successfully",
      data: result,
    });
  }
);

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request & {user?:IAuthUser}, res: Response) => {
    const user = req?.user;
    const query = pick(req.query, ["startDate","endDate"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await doctorScheduleServices.getAllFromDB(query, options,user as IAuthUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Doctor Schedule Fetched Successfully",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  createIntoDB,
  getMySchedule,
  deleteFromDB,
  getAllFromDB
};
