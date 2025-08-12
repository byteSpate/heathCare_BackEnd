import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const {appointmentId} = req.params;
    const result = await paymentServices.initPayment(appointmentId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment Create Successfully",
      data: result,
    });
  }
);


const validatePayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentServices.validatePayment(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment Validate Successfully",
      data: result,
    });
  }
);


export const PaymentController = {
    initPayment,
    validatePayment
}