import status from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { authServices } from "./auth.service";
import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../errors/ApiError";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);

  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User Logged In",
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = await req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "AccessToken Generated Successfully",
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userData = req.user;
    const postData = req.body;

    const result = await authServices.changePassword(userData, postData);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Password Change Successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authServices.forgotPassword(payload);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Reset link sender your email",
      data: result,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || "";

    const result = await authServices.resetPassword(token, req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Password is reset",
      data: result,
    });
  }
);

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
