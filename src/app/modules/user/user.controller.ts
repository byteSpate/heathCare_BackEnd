import { NextFunction, Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { userFilteredAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = pick(req.query, userFilteredAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await userServices.getAllFromDB(query, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Users Fetched",
      meta: result.meta,
      data: result.data,
    });
  }
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createAdmin(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin Created Successfully",
      data: result,
    });
  }
);

const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createDoctor(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Doctor Created Successfully",
      data: result,
    });
  }
);

const createPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createPatient(req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Patient Created Successfully",
      data: result,
    });
  }
);

const changeStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await userServices.changeStatus(id, req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Status Update Successfully",
      data: result,
    });
  }
);

const getMe = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await userServices.getMe(user as IAuthUser);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Fetched Me Successfully",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await userServices.updateMyProfile(user as IAuthUser, req);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Update Successfully",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeStatus,
  getMe,
  updateMyProfile,
};
