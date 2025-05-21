import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import status from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdminAtDb(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin Created Successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
};
