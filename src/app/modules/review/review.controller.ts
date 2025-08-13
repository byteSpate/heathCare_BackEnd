import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { ReviewServices } from "./review.services";

const createIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewServices.createIntoDB(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review Create Successfully",
      data: result,
    });
  }
);

const getAllReview: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await ReviewServices.getAllReview(user as IAuthUser, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Review Retrieved Successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createIntoDB,
  getAllReview,
};
