import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { prescriptionServices } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await prescriptionServices.createIntoDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Prescription Create Successfully",
      data: result,
    });
  }
);

const getMyPrescription: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await prescriptionServices.getMyPrescription(
      user as IAuthUser,options
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Prescription Retrieved Successfully",
      data: result,
    });
  }
);
export const PrescriptionController = {
  createIntoDB,
  getMyPrescription,
};
