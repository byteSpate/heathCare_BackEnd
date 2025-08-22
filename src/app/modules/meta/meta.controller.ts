import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { MetaServices } from "./meta.services";
import { IAuthUser } from "../../interfaces/common";

const fetcheDashboardMetaData: RequestHandler = catchAsync(
  async (req: Request & {user?:IAuthUser}, res: Response) => {
    const user = req.user;
    const result = await MetaServices.fetcheDashboardMetaData(user as IAuthUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Fetched Dashboard Meta Data Retrieved Successfully",
      data: result,
    });
  }
);





export const MetaController = {
  fetcheDashboardMetaData,
}